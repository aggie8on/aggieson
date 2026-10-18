-- The Studio supports images (10 MB in the UI) and audio/video/GIF media (up to 50 MB).
-- Keep bucket restrictions aligned with those upload controls.
update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array['image/*', 'audio/*', 'video/*']
where id = 'portfolio-media';
