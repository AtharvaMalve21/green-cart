import React from "react";
import { Link } from "react-router-dom";

const BreadCrumb = ({product}) => {
  return (
    <div className="flex flex-wrap mb-5 items-center space-x-2 text-sm text-gray-500 font-medium">
      <button onClick={() => navigate("/")} type="button" aria-label="Home">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z"
            fill="#475569"
            stroke="#475569"
            strokeWidth=".094"
          />
        </svg>
      </button>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.784 15.68 11.46 4.13h1.75L8.534 15.68z" fill="#CBD5E1" />
      </svg>
      <Link to={"/products"}>Products</Link>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.784 15.68 11.46 4.13h1.75L8.534 15.68z" fill="#CBD5E1" />
      </svg>
      <Link to={`/products/${product.category.toLowerCase()}`}>
        {product.category}
      </Link>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.784 15.68 11.46 4.13h1.75L8.534 15.68z" fill="#CBD5E1" />
      </svg>
      <p className="text-green-800/100 text-lg">{product.name}</p>
    </div>
  );
};

export default BreadCrumb;
