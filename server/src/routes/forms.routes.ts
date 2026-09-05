import { Router } from 'express';
import { z } from 'zod';
import { ContactMessage } from '../models/ContactMessage.js';
import { Inquiry } from '../models/Inquiry.js';
import { Enrollment } from '../models/Enrollment.js';
import { Student } from '../models/Student.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { sendNotificationEmail } from '../services/email.js';
import { saveLeadToGoogleSheet } from '../services/googleSheets.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createCrudController } from '../controllers/crudFactory.js';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^[0-9+\-\s]{8,16}$/),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
});

const enrollmentSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^[0-9+\-\s]{8,16}$/),
  city: z.string().trim().min(2).max(80),
  college: z.string().trim().min(2).max(120),
  degree: z.string().trim().min(2).max(80),
  branch: z.string().trim().min(2).max(80),
  year: z.string().min(1),
  course: z.string().min(1),
  preferredMode: z.enum(['Online', 'Offline', 'Hybrid', 'Other modes coming soon']),
  message: z.string().trim().max(2000).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
});

export const contactRouter = Router();
contactRouter.post(
  '/',
  validate(contactSchema),
  asyncHandler(async (req, res) => {
    const message = await ContactMessage.create(req.body);
    await Inquiry.create({ ...req.body, status: 'new' });
    await saveLeadToGoogleSheet({
      type: 'Talk to a Mentor',
      name: req.body.name,
      fullName: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message,
    });
    await sendNotificationEmail(`Contact: ${req.body.subject}`, JSON.stringify(req.body, null, 2));
    res.status(201).json({ success: true, data: { id: message.id } });
  }),
);

export const inquiryRouter = Router();
const inquiryCrud = createCrudController(Inquiry, { searchFields: ['name', 'email', 'subject'] });
inquiryRouter.post(
  '/',
  validate(contactSchema),
  asyncHandler(async (req, res) => {
    const item = await Inquiry.create(req.body);
    await saveLeadToGoogleSheet({
      type: 'Talk to a Mentor',
      name: req.body.name,
      fullName: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message,
    });
    await sendNotificationEmail(`Inquiry: ${req.body.subject}`, JSON.stringify(req.body, null, 2));
    res.status(201).json({ success: true, data: item });
  }),
);
inquiryRouter.get('/', requireAuth, requireRole('superadmin', 'admin'), inquiryCrud.list);
inquiryRouter.put('/:id', requireAuth, requireRole('superadmin', 'admin'), inquiryCrud.update);
inquiryRouter.delete('/:id', requireAuth, requireRole('superadmin', 'admin'), inquiryCrud.remove);

export const enrollmentRouter = Router();
const enrollmentCrud = createCrudController(Enrollment, {
  searchFields: ['fullName', 'email', 'course'],
});

enrollmentRouter.post(
  '/',
  validate(enrollmentSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof enrollmentSchema>;
    const student = await Student.findOneAndUpdate(
      { email: body.email },
      {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        city: body.city,
        college: body.college,
        degree: body.degree,
        branch: body.branch,
        year: body.year,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const enrollment = await Enrollment.create({
      ...body,
      student: student._id,
      paymentStatus: body.paymentStatus ?? 'pending',
      paymentProvider: 'none',
      status: 'enquiry',
    });

    await saveLeadToGoogleSheet({
      type: 'Enroll Now',
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      city: body.city,
      college: body.college,
      degree: body.degree,
      branch: body.branch,
      year: body.year,
      course: body.course,
      preferredMode: body.preferredMode,
      message: body.message,
    });

    await sendNotificationEmail(`Enrolment: ${body.course}`, JSON.stringify(body, null, 2));
    res.status(201).json({
      success: true,
      data: { id: enrollment.id, paymentStatus: enrollment.paymentStatus },
    });
  }),
);

enrollmentRouter.get('/', requireAuth, requireRole('superadmin', 'admin'), enrollmentCrud.list);
enrollmentRouter.put('/:id', requireAuth, requireRole('superadmin', 'admin'), enrollmentCrud.update);
enrollmentRouter.delete('/:id', requireAuth, requireRole('superadmin', 'admin'), enrollmentCrud.remove);
