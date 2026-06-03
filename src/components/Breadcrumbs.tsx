import { Fragment } from "react";
import { Link, useLocation } from "react-router";
import { products } from "../mockData";

export function Breadcrumbs() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pathname = location.pathname;

  // Do not render breadcrumbs on the homepage
  if (pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const trail: { label: string; to: string; isLast?: boolean }[] = [
    { label: "Home", to: "/" }
  ];

  if (segments[0] === "shop" || segments[0] === "search") {
    const category = searchParams.get("category");
    const query = searchParams.get("q") || searchParams.get("search");

    if (category) {
      trail.push({ label: "Shop", to: "/shop" });
      trail.push({ label: category, to: `/shop?category=${encodeURIComponent(category)}`, isLast: true });
    } else if (query) {
      trail.push({ label: "Shop", to: "/shop" });
      trail.push({ label: `Search: "${query}"`, to: `/shop?q=${encodeURIComponent(query)}`, isLast: true });
    } else {
      trail.push({ label: "Shop", to: "/shop", isLast: true });
    }
  } else if (segments[0] === "product" && segments[1]) {
    const slug = segments[1];
    const product = products.find((p) => p.slug === slug);
    
    trail.push({ label: "Shop", to: "/shop" });
    if (product) {
      const targetCategory = product.category;
      if (targetCategory === "Linen Sarees") {
        trail.push({ label: "Sarees", to: "/shop?category=Sarees" });
        trail.push({ label: "Linen Sarees", to: "/shop?category=Linen%20Sarees" });
      } else {
        trail.push({ label: targetCategory, to: `/shop?category=${encodeURIComponent(targetCategory)}` });
      }
      trail.push({ label: product.name, to: `/product/${slug}`, isLast: true });
    } else {
      trail.push({ label: "Product", to: `/product/${slug}`, isLast: true });
    }
  } else if (segments[0] === "return-policy") {
    trail.push({ label: "Returns & Exchanges", to: "/return-policy", isLast: true });
  } else if (segments[0] === "shipping-policy") {
    trail.push({ label: "Shipping & Delivery", to: "/shipping-policy", isLast: true });
  } else if (segments[0] === "terms") {
    trail.push({ label: "Terms of Service", to: "/terms", isLast: true });
  } else if (segments[0] === "contact") {
    trail.push({ label: "Contact Us", to: "/contact", isLast: true });
  } else if (segments[0] === "cart") {
    trail.push({ label: "Your Bag", to: "/cart", isLast: true });
  } else if (segments[0] === "checkout") {
    trail.push({ label: "Checkout", to: "/checkout", isLast: true });
  } else if (segments[0] === "wishlist") {
    trail.push({ label: "Wishlist", to: "/wishlist", isLast: true });
  } else {
    // Dynamic fallback for other segments
    let accumulatedPath = "";
    segments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      const formattedLabel = segment
        .replace(/[-_]+/g, " ")
        .replace(/\b[a-z]/g, (char) => char.toUpperCase());
      
      trail.push({
        label: formattedLabel,
        to: accumulatedPath,
        isLast
      });
    });
  }

  return (
    <div className="breadcrumb-wrapper">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        {trail.map((item, idx) => (
          <Fragment key={idx}>
            {idx > 0 && <span className="separator">/</span>}
            {item.isLast ? (
              <span className="current-page">{item.label}</span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
          </Fragment>
        ))}
      </nav>
    </div>
  );
}
