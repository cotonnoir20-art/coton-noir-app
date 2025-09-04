-- Créer un bucket pour les photos de cheveux
INSERT INTO storage.buckets (id, name, public)
VALUES ('hair-photos', 'hair-photos', false);

-- Créer les politiques RLS pour le bucket hair-photos
CREATE POLICY "Users can upload their own hair photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'hair-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own hair photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hair-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own hair photos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'hair-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own hair photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'hair-photos' AND auth.uid()::text = (storage.foldername(name))[1]);