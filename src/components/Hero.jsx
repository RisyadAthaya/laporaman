import heroImage from '../assets/Hero Section.png'

function Hero() {
  const handleScrollToDori = (e) => {
    e.preventDefault();
    const element = document.getElementById('mengapa-lapor-aman');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <section
          className="hero-section"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 65%, #028F65 100%), url('${heroImage}')`,
          }}
      >
        <div className="hero-layout">
          <h1 className="hero-headline">
            Check out,<br />before you head out
          </h1>
          <button
              onClick={handleScrollToDori}
              className="readmore-btn"
              aria-label="Read more about Lapor Aman"
          >
            Read More
          </button>
        </div>
      </section>
  )
}

export default Hero