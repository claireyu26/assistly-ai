-- Add knowledge_base field to ai_config table
ALTER TABLE ai_config ADD COLUMN IF NOT EXISTS knowledge_base TEXT;
