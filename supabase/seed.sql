-- ==============================================================================
-- NEXUS SaaS — Seed Data & Administrative Promotion Script
-- ==============================================================================
-- Run this script in the Supabase SQL Editor AFTER registering:
-- 1. admin@test.com (Password: e.g. Test1234!)
-- 2. user@test.com  (Password: e.g. Test1234!)
-- ==============================================================================

-- 1. Grant Administrator & PRO Tier to admin@test.com
UPDATE public.profiles
SET 
  role = 'ADMIN',
  subscription_tier = 'PRO',
  updated_at = now()
WHERE email = 'admin@test.com';

-- 2. Ensure user@test.com is standard USER with FREE Tier
UPDATE public.profiles
SET 
  role = 'USER',
  subscription_tier = 'FREE',
  updated_at = now()
WHERE email = 'user@test.com';

-- 3. Seed Demonstration Project: "Online Store Redesign"
DO $$
DECLARE
  v_owner_id UUID;
  v_project_id UUID;
BEGIN
  -- Select owner: prioritize admin@test.com, fallback to user@test.com, or any first registered profile
  SELECT id INTO v_owner_id FROM public.profiles WHERE email = 'admin@test.com' LIMIT 1;
  IF v_owner_id IS NULL THEN
    SELECT id INTO v_owner_id FROM public.profiles WHERE email = 'user@test.com' LIMIT 1;
  END IF;
  IF v_owner_id IS NULL THEN
    SELECT id INTO v_owner_id FROM public.profiles LIMIT 1;
  END IF;

  -- Only proceed if at least one user profile exists
  IF v_owner_id IS NOT NULL THEN
    -- Check if project already exists
    SELECT id INTO v_project_id 
    FROM public.projects 
    WHERE name = 'Online Store Redesign' AND owner_id = v_owner_id 
    LIMIT 1;

    -- Create Project if it does not exist
    IF v_project_id IS NULL THEN
      INSERT INTO public.projects (
        name,
        description,
        color,
        owner_id,
        created_at,
        updated_at
      ) VALUES (
        'Online Store Redesign',
        'Next-generation e-commerce storefront redesign with spatial 3D interactivity, Cyber-Glass design system, and frictionless Stripe checkout.',
        '#6366f1',
        v_owner_id,
        now() - INTERVAL '5 days',
        now()
      ) RETURNING id INTO v_project_id;

      -- Add owner as project member
      INSERT INTO public.project_members (project_id, user_id, role)
      VALUES (v_project_id, v_owner_id, 'OWNER')
      ON CONFLICT (project_id, user_id) DO NOTHING;

      -- Add project creation log
      INSERT INTO public.activity_logs (project_id, user_id, action, metadata, created_at)
      VALUES (
        v_project_id,
        v_owner_id,
        'CREATED_PROJECT',
        jsonb_build_object('name', 'Online Store Redesign'),
        now() - INTERVAL '5 days'
      );
    END IF;

    -- Clean existing tasks for this demo project to avoid duplicates on re-run
    DELETE FROM public.tasks WHERE project_id = v_project_id;

    -- Task 1: TODO (Priority: HIGH)
    INSERT INTO public.tasks (
      project_id,
      title,
      description,
      status,
      priority,
      order_index,
      assignee_id,
      deadline,
      created_at
    ) VALUES (
      v_project_id,
      'Implement Checkout Flow & Stripe Payment Intent',
      'Integrate Stripe Checkout and Payment Intent webhooks for subscription upgrades and billing portal sessions.',
      'TODO',
      'HIGH',
      0,
      v_owner_id,
      now() + INTERVAL '4 days',
      now() - INTERVAL '2 days'
    );

    -- Task 2: IN_PROGRESS (Priority: URGENT)
    INSERT INTO public.tasks (
      project_id,
      title,
      description,
      status,
      priority,
      order_index,
      assignee_id,
      deadline,
      created_at
    ) VALUES (
      v_project_id,
      'Spatial 3D Product Showcase with Glassmorphism',
      'Construct interactive 3D card tilt and holographic floating badges for featured products using Framer Motion.',
      'IN_PROGRESS',
      'URGENT',
      0,
      v_owner_id,
      now() + INTERVAL '2 days',
      now() - INTERVAL '3 days'
    );

    -- Task 3: IN_REVIEW (Priority: MEDIUM)
    INSERT INTO public.tasks (
      project_id,
      title,
      description,
      status,
      priority,
      order_index,
      assignee_id,
      deadline,
      created_at
    ) VALUES (
      v_project_id,
      'Responsive Navigation & Mobile Drawer Refactor',
      'Audit cyber-glass sidebar and mobile sheet overlay for touch devices across iOS and Android browsers.',
      'IN_REVIEW',
      'MEDIUM',
      0,
      v_owner_id,
      now() + INTERVAL '1 day',
      now() - INTERVAL '4 days'
    );

    -- Task 4: DONE (Priority: LOW)
    INSERT INTO public.tasks (
      project_id,
      title,
      description,
      status,
      priority,
      order_index,
      assignee_id,
      deadline,
      created_at
    ) VALUES (
      v_project_id,
      'Design System Core & Tailwind Cyber-Glass Tokens',
      'Establish global CSS variables, backdrop blur filters, volumetric neon glow borders, and Typography hierarchy.',
      'DONE',
      'LOW',
      0,
      v_owner_id,
      now() - INTERVAL '1 day',
      now() - INTERVAL '5 days'
    );

    -- Add activity log for demo movement
    INSERT INTO public.activity_logs (project_id, user_id, action, metadata, created_at)
    VALUES (
      v_project_id,
      v_owner_id,
      'MOVED_TASK',
      jsonb_build_object('title', 'Design System Core & Tailwind Cyber-Glass Tokens', 'newStatus', 'DONE'),
      now() - INTERVAL '1 day'
    );

    -- Add welcome notification
    INSERT INTO public.notifications (user_id, title, message, type, is_read, created_at)
    VALUES (
      v_owner_id,
      'Welcome to NEXUS Spatial Workspace',
      'Your demo project "Online Store Redesign" is configured with 4 interactive Kanban tasks ready for review.',
      'SYSTEM',
      false,
      now()
    );

    RAISE NOTICE 'Demo project "Online Store Redesign" seeded successfully for user %', v_owner_id;
  ELSE
    RAISE NOTICE 'No user profiles found. Please register admin@test.com or user@test.com via /register first, then re-run this script.';
  END IF;
END $$;
