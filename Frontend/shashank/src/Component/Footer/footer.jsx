import React from "react";

export default function Footer() {
return ( <footer className="bg-slate-900 px-4 pb-8 pt-16 dark:bg-neutral-900 md:px-8">

  <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4">

    {/* SHOP */}
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-slate-50">
        Shop
      </h3>

      <ul className="space-y-4 text-sm font-normal text-slate-400">
        <li>
          <a
            href="/"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            All Products
          </a>
        </li>

        <li>
          <a
            href="/"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            New Arrivals
          </a>
        </li>

        <li>
          <a
            href="/"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Best Sellers
          </a>
        </li>

        <li>
          <a
            href="/"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Today's Deals
          </a>
        </li>

        <li>
          <a
            href="/cart"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Shopping Cart
          </a>
        </li>

        <li>
          <a
            href="/"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Explore Categories
          </a>
        </li>
      </ul>
    </div>

    {/* CUSTOMER SERVICE */}
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-slate-50">
        Customer Service
      </h3>

      <ul className="space-y-4 text-sm font-normal text-slate-400">
        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Help Center
          </a>
        </li>

        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Contact Us
          </a>
        </li>

        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Track Your Order
          </a>
        </li>

        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Shipping Information
          </a>
        </li>

        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Returns & Refunds
          </a>
        </li>

        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Frequently Asked Questions
          </a>
        </li>
      </ul>
    </div>

    {/* POLICIES */}
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-slate-50">
        Policies
      </h3>

      <ul className="space-y-4 text-sm font-normal text-slate-400">
        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Terms & Conditions
          </a>
        </li>

        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Privacy Policy
          </a>
        </li>

        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Shipping Policy
          </a>
        </li>

        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Return Policy
          </a>
        </li>

        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Cancellation Policy
          </a>
        </li>

        <li>
          <a
            href="#"
            className="rounded transition-all hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Payment & Security
          </a>
        </li>
      </ul>
    </div>

    {/* CONNECT */}
    <div className="space-y-6">

      <div>
        <h3 className="text-sm font-semibold text-slate-50">
          Stay Connected
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Follow us for new products, exclusive offers and special deals.
        </p>
      </div>

      {/* SOCIAL ICONS */}
      <ul className="flex flex-wrap gap-4">

        {/* FACEBOOK */}
        <li>
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 p-2 transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-full fill-slate-50"
              viewBox="0 0 155.139 155.139"
              aria-hidden="true"
            >
              <path d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761z" />
            </svg>
          </a>
        </li>

        {/* LINKEDIN */}
        <li>
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 p-2 transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-full fill-slate-50"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M23.994 24v-.001H24v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07V7.976H8.489v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243V24zM.396 7.977h4.976V24H.396zM2.882 0C1.291 0 0 1.291 0 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909A2.884 2.884 0 0 0 2.882 0" />
            </svg>
          </a>
        </li>

        {/* X */}
        <li>
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 p-2 transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="X"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-full fill-slate-50"
              viewBox="0 0 1226.37 1226.37"
              aria-hidden="true"
            >
              <path d="M727.348 519.284 1174.075 0h-105.86L680.322 450.887 370.513 0H13.185l468.492 681.821L13.185 1226.37h105.866l409.625-476.152 327.181 476.152h357.328L727.322 519.284zM582.35 687.828l-47.468-67.894-377.686-540.24H319.8l304.797 435.991 47.468 67.894 396.2 566.721H905.661L582.35 687.854z" />
            </svg>
          </a>
        </li>

      </ul>

      {/* NEWSLETTER */}
      <div className="!mt-8">
        <h4 className="text-sm font-semibold text-slate-50">
          Get exclusive offers
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Sign up to receive new arrivals, special discounts and shopping deals.
        </p>

        <div className="mt-5 flex max-w-sm">

          <input
            type="email"
            placeholder="Enter your email"
            className="min-w-0 flex-1 rounded-l-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
          />

          <button
            type="button"
            className="rounded-r-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Subscribe
          </button>

        </div>
      </div>
    </div>
  </div>

  <hr className="my-8 border-slate-700" />

  {/* BOTTOM FOOTER */}
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

    <p className="text-sm text-slate-400">
      © 2026 YourStore. All rights reserved.
    </p>

    <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
      <span>🔒 Secure Payments</span>
      <span>🚚 Fast Delivery</span>
      <span>↩ Easy Returns</span>
    </div>

  </div>

</footer>

)};