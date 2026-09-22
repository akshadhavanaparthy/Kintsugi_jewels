import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <p className="small-title"><b>TIMELESS ELEGANCE</b></p>

          <h1><em>
            Jewellery That
            <br />
            Tells Your Story
          </em></h1>

          <p>
            Discover exquisite jewellery crafted to celebrate
            your most beautiful moments and unforgettable memories.
          </p>

          <Link to="/jewellery">
            <button className="shop-button">
              EXPLORE COLLECTION
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;

