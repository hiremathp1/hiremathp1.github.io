<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mock Landing Page - Video Hero</title>
    <style>
        body {
            margin: 0;
            font-family: 'Inter', Arial, sans-serif;
            background: #fff;
        }
        .hero {
            position: relative;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            overflow: hidden;
        }
        .hero-video {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: -2;
        }
        .hero-video video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .video-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.35);
            z-index: -1;
        }
        .hero-content {
            position: relative;
            z-index: 1;
            color: #fff;
            max-width: 900px;
            margin: 0 auto;
        }
        .hero-content h1 {
            font-size: 2.5rem;
            font-weight: 300;
            line-height: 1.2;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        @media (max-width: 600px) {
            .hero-content h1 {
                font-size: 1.3rem;
            }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="hero-video">
            <video autoplay muted loop playsinline poster="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80">
                <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="video-overlay"></div>
        </div>
        <div class="hero-content">
            <h1>Design, engineering and delivery working as one<br>to shape how people think, work and perform</h1>
        </div>
    </section>
</body>
</html> 