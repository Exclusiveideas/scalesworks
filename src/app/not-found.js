import "./NotFoundPage.css"; // Import the CSS file
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <section className="page_404">
      <div className="container_content">
        <h1 className="text-four_zero_four">404</h1>
        <img
          src={`https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif`}
          alt="404 Image"
          className="Four-O-Four-Image"
        />
        <div className="contant_box_404">
          <h3 className="h2">Looks like you're lost</h3>
          <p>The page you are looking for is not available!</p>
          <Link href="/" className="link_404">
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
