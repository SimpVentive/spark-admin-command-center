
-- Seed global content items (company_id = NULL means global)
INSERT INTO public.content_items (title, content_type, description, file_format, tags, is_active, company_id, category_id)
VALUES
  ('POSH Compliance Essentials', 'document', 'Comprehensive Prevention of Sexual Harassment training module covering legal requirements and workplace policies.', 'pdf', ARRAY['compliance','posh','mandatory'], true, NULL, NULL),
  ('Code of Conduct', 'document', 'Organization-wide code of conduct covering ethics, integrity, and professional behavior standards.', 'pdf', ARRAY['compliance','ethics','mandatory'], true, NULL, NULL),
  ('Workplace Safety Fundamentals', 'video', 'Video training on workplace safety protocols, emergency procedures, and hazard identification.', 'mp4', ARRAY['safety','mandatory','ehs'], true, NULL, NULL),
  ('Data Privacy Essentials', 'document', 'Training on data privacy regulations, GDPR compliance, and information security best practices.', 'pdf', ARRAY['compliance','privacy','security'], true, NULL, NULL),
  ('Anti-Bribery & Corruption', 'document', 'Anti-bribery and corruption awareness training covering legal frameworks and reporting procedures.', 'pdf', ARRAY['compliance','legal','abc'], true, NULL, NULL),
  ('Induction & Onboarding Pack', 'presentation', 'Complete onboarding program for new employees including company overview and role orientation.', 'pptx', ARRAY['hr','onboarding','induction'], true, NULL, NULL),
  ('Leadership 101 Program', 'video', 'Foundational leadership development program covering communication, delegation, and team management.', 'mp4', ARRAY['leadership','soft-skills','development'], true, NULL, NULL),
  ('Sales Competency Assessment', 'document', 'Assessment framework for evaluating sales team competencies and identifying skill gaps.', 'pdf', ARRAY['sales','assessment','competency'], true, NULL, NULL),
  ('Competency Dictionary Template', 'document', 'Standardized competency dictionary template for defining role-based competency frameworks.', 'xlsx', ARRAY['hr','competency','template'], true, NULL, NULL),
  ('Negotiation & Influence Skills', 'video', 'Advanced training on negotiation techniques, persuasion, and stakeholder influence strategies.', 'mp4', ARRAY['soft-skills','negotiation','advanced'], true, NULL, NULL),
  ('Technical Writing for Engineers', 'document', 'Guide to effective technical documentation, specifications writing, and engineering communication.', 'pdf', ARRAY['technical','writing','engineering'], true, NULL, NULL),
  ('Project Management Basics', 'presentation', 'Introduction to project management methodologies including Agile, Waterfall, and hybrid approaches.', 'pptx', ARRAY['technical','project-management','basics'], true, NULL, NULL),
  ('Finance for Non-Finance', 'presentation', 'Financial literacy course for non-finance professionals covering budgets, P&L, and financial statements.', 'pptx', ARRAY['business','finance','literacy'], true, NULL, NULL),
  ('Digital Workplace Skills', 'video', 'Training on digital tools, remote collaboration, and modern workplace technology adoption.', 'mp4', ARRAY['it','digital','workplace'], true, NULL, NULL);
