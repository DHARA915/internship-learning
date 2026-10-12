"use client";

import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProductCard from "../src/components/ProductCard";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  rating: number;
  stock: number;
  description: string;
  thumbnail: string;
};

type ProductResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

const LIMIT = 12;

async function fetchProducts(page: number): Promise<ProductResponse> {
  const skip = (page - 1) * LIMIT;

  const res = await fetch(
    `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  const data: ProductResponse = await res.json();

  console.log("Products:", data);

  return data;
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page),
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <h1 className="p-2 font-semibold text-foreground-primary" >All Products</h1>

      <div className="grid mt-3 md:grid-cols-4 gap-3 grid-cols-1">
        {data?.products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            image={product.thumbnail}
            rating={product.rating}
          />
        ))}
      </div>
    </div>
  );
}
