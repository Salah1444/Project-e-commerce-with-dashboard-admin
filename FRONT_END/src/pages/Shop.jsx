import { useDispatch, useSelector } from "react-redux";
import Directory from "@/components/Directory";
import { FilterProducts, ResetFilter } from "@/store/productsSlice";
import Loading from "@/components/Loading";
import { useState } from "react";
import Counter from "@/components/Counter";

function Shop() {
  const loading   = useSelector(st => st.store.loading);
  const category  = useSelector(st => st.category.category);
  const products = useSelector(st => st.products.produits);
  const dispatch  = useDispatch();
  const [selected, setSelected] = useState(null);

  const handleFilter = (cat) => {
    if (selected === cat) {
      setSelected(null);
      dispatch(ResetFilter());
    } else {
      setSelected(cat);
      dispatch(FilterProducts(cat));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="mt-16 min-h-screen bg-white dark:bg-slate-900
                    transition-colors duration-300">

      {/* ══ Hero Banner ══ */}
      <div className="relative bg-amber-950 dark:bg-slate-800
                      px-6 py-16 text-center overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full
                        bg-amber-500/20 blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full
                        bg-amber-400/10 blur-3xl" />

        <p className="text-amber-400 text-sm font-semibold tracking-widest
                      uppercase mb-3">
          Welcome to our store
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover Our Collection
        </h1>
        <p className="text-amber-100/70 dark:text-slate-400
                      max-w-xl mx-auto text-base leading-relaxed">
          Carefully selected products to offer you the best shopping
          experience. Quality guaranteed, fast delivery.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-10 mt-8">
          {[
            { value: `${Counter({ final_time: 500})} +`, label: "Products"  },
            { value: Counter({ final_time: category.length - 1})  + '+',  label: "Brands"    },
            { value: "24h",  label: "Delivery"  },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-amber-400">{value}</p>
              <p className="text-xs text-amber-100/60 uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-8 py-10">

        {/* ══ Categories ══ */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-amber-500 text-xs font-semibold
                            uppercase tracking-widest mb-1">
                Browse by
              </p>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Our Categories
              </h2>
            </div>
            {selected && (
              <button
                onClick={() => { setSelected(null); dispatch(ResetFilter()); }}
                className="text-sm text-amber-600 dark:text-amber-400
                           hover:underline flex items-center gap-1"
              >
                ✕ Clear filter
              </button>
            )}
          </div>

          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
            Click on a category to filter products
            {selected && (
              <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                — Selected: <strong>{selected}</strong>
              </span>
            )}
          </p>

          {category?.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8">
              {category.map((cat) => {
                const isActive = selected === cat.category;
                return (
                  <div
                    key={cat._id}
                    onClick={() => handleFilter(cat.category)}
                    className="flex flex-col items-center cursor-pointer group w-28"
                  >
                    <div className={`rounded-full p-1 transition-all duration-300
                      ${isActive
                        ? "ring-4 ring-amber-500 ring-offset-2 dark:ring-offset-slate-900"
                        : "ring-2 ring-transparent"}`}>
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/category/${cat.Image}`}
                        alt={cat.category}
                        className={`w-24 h-24 object-cover rounded-full shadow-md
                          transition-all duration-300
                          ${isActive
                            ? "scale-105 border-4 border-amber-400"
                            : "border-4 border-gray-200 dark:border-slate-600 group-hover:border-amber-400"}`}
                      />
                    </div>
                    <span className={`mt-2 text-sm font-medium text-center
                      transition-colors duration-200
                      ${isActive
                        ? "text-amber-500 font-bold"
                        : "text-gray-700 dark:text-slate-300 group-hover:text-amber-500"}`}>
                      {cat.category}
                    </span>
                    {isActive && (
                      <span className="text-xs text-amber-400 mt-0.5">● active</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">🗂️</p>
              <p className="text-gray-400 dark:text-slate-500">
                No categories available at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
          <span className="text-gray-400 dark:text-slate-500 text-sm whitespace-nowrap">
            ✦ All products ✦
          </span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
        </div>

        {/* ══ Products ══ */}
        <div className="mb-6">
          <p className="text-amber-500 text-xs font-semibold
                        uppercase tracking-widest mb-1">
            {selected ? `Category : ${selected}` : "Full collection"}
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {selected ? `Products — ${selected}` : "All Products"}
            </h2>
            <p className="text-sm text-gray-400 dark:text-slate-500">
              Sorted by popularity
            </p>
          </div>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
            {selected
              ? `Showing products from the "${selected}" category.`
              : "Explore our entire catalog and find what you need."}
          </p>
        </div>

        <Directory  products={products}/>

        {/* Bottom CTA */}
        <div className="mt-16 text-center py-10 border-t
                        border-gray-100 dark:border-slate-800">
          <p className="text-gray-400 dark:text-slate-500 text-sm">
            Can't find what you're looking for?
          </p>
          <a href="/Contact"
             className="text-amber-600 dark:text-amber-400 font-semibold
                        text-sm hover:underline">
            Contact us →
          </a>
        </div>

      </div>
    </div>
  );
}

export default Shop;