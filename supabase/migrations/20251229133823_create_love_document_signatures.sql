/*
  # Love Document Signatures System

  1. New Tables
    - `love_document`
      - `id` (uuid, primary key)
      - `gustavo_signed` (boolean, default false)
      - `gustavo_signed_at` (timestamptz, nullable)
      - `jennifer_signed` (boolean, default false)
      - `jennifer_signed_at` (timestamptz, nullable)
      - `both_signed_at` (timestamptz, nullable) - Timestamp when both signatures are completed
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `love_document` table
    - Add policy for public read access (no auth required for this romantic app)
    - Add policy for public write access (no auth required)

  3. Notes
    - This table stores the signature state of the love document
    - Only one record should exist (the active love document)
*/

CREATE TABLE IF NOT EXISTS love_document (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gustavo_signed boolean DEFAULT false NOT NULL,
  gustavo_signed_at timestamptz,
  jennifer_signed boolean DEFAULT false NOT NULL,
  jennifer_signed_at timestamptz,
  both_signed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE love_document ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to love document"
  ON love_document
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to love document"
  ON love_document
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to love document"
  ON love_document
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

/*
  # Create tree_messages table for romantic letter feature

  1. New Tables
    - `tree_messages`
      - `id` (uuid, primary key)
      - `message` (text, user's comment/message)
      - `created_at` (timestamptz, when message was added)

  2. Security
    - Enable RLS on `tree_messages` table
    - Add policy allowing authenticated users to insert messages
    - Add policy allowing all users to select/read messages
    - Set max message limit to 400 per document (enforced at application level)

  3. Notes
    - Messages are immutable (no edit/delete after creation)
    - Max 400 messages limit enforced by application logic
    - All messages visible to all authenticated users with correct login date
*/
CREATE TABLE IF NOT EXISTS tree_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tree_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tree messages"
  ON tree_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can add tree messages"
  ON tree_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
