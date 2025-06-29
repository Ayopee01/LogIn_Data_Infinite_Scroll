"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const LIMIT = 20;

interface SizeQty {
  size: string;
  qty: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  clothing_sizes?: SizeQty[];
  shoe_sizes?: SizeQty[];
  "text-color"?: string | string[];
  color?: string | string[];
  detail?: string[];
  category?: string;
  img?: string[];
  stock?: number;
}

const CATEGORY_OPTIONS = ["Shirt", "Pants", "Shoe", "Other"];

function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<Partial<Product>>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // โหลดข้อมูลทั้งหมด
  useEffect(() => {
    setLoading(true);
    axios
      .get<Product[]>("https://webservice-api-adidas.onrender.com/api/products")
      .then((res) => {
        setAllProducts(res.data);
        setDisplayProducts(res.data.slice(0, LIMIT));
        setHasMore(res.data.length > LIMIT);
      })
      .catch((err) => {
        setHasMore(false);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (page === 1) return;
    setDisplayProducts(allProducts.slice(0, page * LIMIT));
    setHasMore(allProducts.length > page * LIMIT);
  }, [page, allProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "No.",
      "Name",
      "Price",
      "Original Price",
      "Discount",
      "Color",
      "Text Color",
      "Sizes",
      "Stock",
      "Category"
    ];
    const rows = allProducts.map((item, idx) => {
      const colors: string[] = Array.isArray(item.color)
        ? item.color
        : item.color
          ? [item.color]
          : [];
      const textColors: string[] = Array.isArray(item["text-color"])
        ? item["text-color"] as string[]
        : item["text-color"]
          ? [item["text-color"] as string]
          : [];
      const isShoe = item.category === "Shoe";
      const sizeList = isShoe
        ? item.shoe_sizes || []
        : item.clothing_sizes || [];
      const sizeText = sizeList.map(s => `${s.size}:${s.qty}`).join("|");
      const totalStock = sizeList.length > 0
        ? sizeList.reduce((sum, s) => sum + (s.qty || 0), 0)
        : item.stock || 0;

      return [
        idx + 1,
        `"${item.name}"`,
        item.price,
        item.originalPrice ?? "",
        item.discount ?? "",
        `"${colors.join("/")}"`,
        `"${textColors.join("/")}"`,
        `"${sizeText}"`,
        totalStock,
        item.category || ""
      ].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Inline edit
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditRow({ ...displayProducts[idx] });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditRow({
      ...editRow,
      [e.target.name]: e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value
    });
  };
  const handleSave = (idx: number) => {
    const prodId = displayProducts[idx].id;
    const newAll = allProducts.map((prod) =>
      prod.id === prodId ? { ...prod, ...editRow } : prod
    );
    setAllProducts(newAll);
    setDisplayProducts(newAll.slice(0, page * LIMIT));
    setEditIdx(null);
    setEditRow({});
  };
  const handleDelete = (idx: number) => {
    const prodId = displayProducts[idx].id;
    const newAll = allProducts.filter((prod) => prod.id !== prodId);
    setAllProducts(newAll);
    setDisplayProducts(newAll.slice(0, page * LIMIT));
    setEditIdx(null);
    setEditRow({});
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-3 border">#</th>
              <th className="py-2 px-3 border">Image</th>
              <th className="py-2 px-3 border">Name</th>
              <th className="py-2 px-3 border">Price</th>
              <th className="py-2 px-3 border">Discount</th>
              <th className="py-2 px-3 border">Color</th>
              <th className="py-2 px-3 border">Sizes</th>
              <th className="py-2 px-3 border">Stock</th>
              <th className="py-2 px-3 border">Category</th>
              <th className="py-2 px-3 border">Status</th>
              <th className="py-2 px-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.map((item, idx) => {
              const colors: string[] = Array.isArray(item.color)
                ? item.color
                : item.color
                  ? [item.color]
                  : [];
              const textColors: string[] = Array.isArray(item["text-color"])
                ? item["text-color"] as string[]
                : item["text-color"]
                  ? [item["text-color"] as string]
                  : [];
              const isShoe = item.category === "Shoe";
              const sizeList = isShoe
                ? item.shoe_sizes || []
                : item.clothing_sizes || [];
              const totalStock = sizeList.length > 0
                ? sizeList.reduce((sum, s) => sum + (s.qty || 0), 0)
                : item.stock || 0;
              const hasDiscount = !!item.discount && item.discount > 0;
              const priceValue = hasDiscount ? item.price : (item.originalPrice ?? item.price);

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-3 border text-center">{idx + 1}</td>
                  <td className="py-2 px-3 border text-center">
                    <img
                      src={item.img?.[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                      loading="lazy"
                    />
                  </td>
                  {/* Name */}
                  <td className="py-2 px-3 border">
                    {editIdx === idx ? (
                      <input
                        name="name"
                        value={editRow.name ?? ""}
                        onChange={handleChange}
                        className="border px-1 py-0.5 w-full"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  {/* Price */}
                  <td className="py-2 px-3 border">
                    {editIdx === idx ? (
                      <input
                        name="price"
                        type="number"
                        value={editRow.price ?? ""}
                        onChange={handleChange}
                        className="border px-1 py-0.5 w-16"
                      />
                    ) : (
                      <span className="font-bold text-blue-700">
                        {priceValue?.toLocaleString()} ฿
                      </span>
                    )}
                    {hasDiscount && item.originalPrice && editIdx !== idx && (
                      <span className="text-gray-400 line-through ml-2">
                        {item.originalPrice?.toLocaleString()} ฿
                      </span>
                    )}
                  </td>
                  {/* Discount */}
                  <td className="py-2 px-3 border text-center">
                    {editIdx === idx ? (
                      <input
                        name="discount"
                        type="number"
                        value={editRow.discount ?? ""}
                        onChange={handleChange}
                        className="border px-1 py-0.5 w-12"
                      />
                    ) : (
                      hasDiscount ? (
                        <span className="text-green-600 font-semibold">{item.discount}%</span>
                      ) : ""
                    )}
                  </td>
                  {/* Color */}
                  <td className="py-2 px-3 border text-center">
                    {colors.map((col, i) => (
                      <span
                        key={col + i}
                        className="inline-block w-5 h-5 rounded-full border mr-1"
                        style={{ background: col }}
                        title={textColors[i] || col}
                      ></span>
                    ))}
                    <span className="ml-2 align-middle">
                      {textColors.length > 0
                        ? textColors.join(" / ")
                        : colors.join(" / ")}
                    </span>
                  </td>
                  {/* Sizes */}
                  <td className="py-2 px-3 border text-center">
                    {sizeList.length > 0 ? (
                      <table className="mx-auto border border-gray-300 rounded text-xs">
                        <thead>
                          <tr>
                            <th className="px-2 py-1 border bg-gray-50">Size</th>
                            <th className="px-2 py-1 border bg-gray-50">Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeList.map((s, i) => (
                            <tr key={s.size + i}>
                              <td className="px-2 py-1 border">{s.size}</td>
                              <td className="px-2 py-1 border">{s.qty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      "-"
                    )}
                  </td>
                  {/* Stock */}
                  <td className="py-2 px-3 border text-center">
                    {editIdx === idx ? (
                      <input
                        name="stock"
                        type="number"
                        value={editRow.stock ?? ""}
                        onChange={handleChange}
                        className="border px-1 py-0.5 w-12"
                      />
                    ) : (
                      totalStock
                    )}
                  </td>
                  {/* Category */}
                  <td className="py-2 px-3 border text-center">
                    {editIdx === idx ? (
                      <select
                        name="category"
                        value={editRow.category ?? ""}
                        onChange={handleChange}
                        className="border px-1 py-0.5"
                      >
                        <option value="">-</option>
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option value={cat} key={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.category || "-"
                    )}
                  </td>
                  {/* Status */}
                  <td className="py-2 px-3 border text-center">
                    {totalStock > 0 ? (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  {/* Action */}
                  <td className="py-2 px-3 border text-center" style={{ minWidth: 90 }}>
                    {editIdx === idx ? (
                      <button
                        className="text-green-700 hover:underline mr-2"
                        onClick={() => handleSave(idx)}
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          className="text-yellow-600 hover:underline mr-2"
                          onClick={() => handleEdit(idx)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(idx)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {displayProducts.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-4">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-center py-4">
          {loading ? "Loading..." : !hasMore && "No more products"}
        </div>
      </div>
    </div>
  );
}

export default Home;
