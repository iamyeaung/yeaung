CREATE TABLE daily_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    mood text,
    tags text[],
    user_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Open test policy for development
CREATE POLICY "Enable all actions for everyone" ON daily_logs
    FOR ALL
    USING (true)
    WITH CHECK (true);
