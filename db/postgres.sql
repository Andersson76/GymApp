DO $$
BEGIN
  RAISE NOTICE '✔ SQL init script is running!';
END
$$;

-- Skapa tabellen för användare
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skapa tabellen för träningspass
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT
);

-- Skapa tabellen för övningar
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  muscle_group TEXT
);

-- Skapa kopplingstabellen mellan workouts och exercises
CREATE TABLE workout_exercises (
  id SERIAL PRIMARY KEY,
  workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight NUMERIC(5,2)
);

--Testdata (aanvändare)
INSERT INTO users (name, email)
VALUES ('Testperson', 'test@example.com');
