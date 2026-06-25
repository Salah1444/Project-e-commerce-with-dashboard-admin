import about from "@/assets/images/about_us.jpg";
import WhyTrustUs from "@/assets/images/WhyTrustUs.webp";
import OurStoryImg from "@/assets/images/story.jpg";
import { motion } from "framer-motion";
import { useState } from "react";

/* ─── tiny helpers ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const SectionLabel = ({ children }) => (
  <motion.span
    className="inline-block mb-3 text-xs font-semibold tracking-[0.18em] uppercase
               text-amber-500 dark:text-amber-400"
    variants={fadeUp}
    custom={0}
  >
    {children}
  </motion.span>
);

const AccentTitle = ({ children }) => (
  <motion.h2
    className="relative pb-4 mb-6 font-['Playfair_Display'] text-4xl font-bold
               text-slate-900 dark:text-slate-50
               after:absolute after:bottom-0 after:left-0
               after:h-[3px] after:w-12 after:rounded-full
               after:bg-amber-400 after:dark:bg-amber-500"
    variants={fadeUp}
    custom={0.1}
  >
    {children}
  </motion.h2>
);

/* ─── component ────────────────────────────────────────── */
function About() {
  const [expanded, setExpanded] = useState(false);

  const aboutText =
    "Our journey began with a simple vision: to create an online shopping experience built on trust, quality, and customer satisfaction. What started as a passion for e-commerce grew into a dedicated platform focused on delivering carefully selected products that meet real everyday needs — because we believe shopping should be easy, transparent, and genuinely enjoyable.";

  const trustPoints = [
    {
      icon: "✦",
      title: "Curated catalogue",
      desc: "Every product is hand-picked for quality and real-world value.",
    },
    {
      icon: "◈",
      title: "Honest pricing",
      desc: "Fair, transparent costs with no hidden fees — ever.",
    },
    {
      icon: "⬡",
      title: "Secure checkout",
      desc: "Industry-standard encryption on every transaction.",
    },
    {
      icon: "◉",
      title: "Responsive support",
      desc: "A real team ready to help before, during, and after your order.",
    },
  ];

  const story = [
    "Started with a deep passion for e-commerce and innovation, our journey began with a simple idea: to make online shopping easier, more reliable, and accessible for everyone. What started as a small project driven by curiosity quickly evolved into a growing store built on dedication and a clear vision.",
    "From the very beginning, our focus has been on carefully selecting products that truly bring value to customers' everyday lives. We believe shopping online should not only be convenient but also trustworthy — so we prioritise transparency, honest pricing, and secure transactions.",
    "As our community grew, so did our commitment to improvement. We continuously listen to feedback, refine our services, and adopt new technologies to provide a smoother experience. Our support team works every day to ensure every order meets expectations.",
    "Today, our store continues to grow thanks to the trust and loyalty of our customers. We are more than just a shop — we are a team passionate about building long-term relationships and creating an experience people rely on again and again.",
  ];

  const visibleStory = expanded ? story : story.slice(0, 2);

  return (
    <div
      className="font-['Inter'] bg-slate-50 dark:bg-slate-950
                 text-slate-700 dark:text-slate-300
                 transition-colors duration-300"
    >
      {/* ── About Us ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* decorative blob */}
        <div
          className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px]
                        rounded-full bg-amber-400/10 dark:bg-amber-500/5 blur-3xl"
        />

        <div className="mx-auto max-w-6xl px-6 py-28 lg:px-16
                        flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-24">
          {/* text */}
          <motion.div
            className="flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <SectionLabel>Who we are</SectionLabel>
            <AccentTitle>About Us</AccentTitle>
            <motion.p
              className="leading-relaxed text-slate-500 dark:text-slate-400 max-w-lg"
              variants={fadeUp}
              custom={0.2}
            >
              {aboutText}
            </motion.p>
          </motion.div>

          {/* image */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.img
              src={about}
              alt="About Us"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-sm rounded-3xl object-cover shadow-2xl
                         ring-1 ring-slate-200 dark:ring-slate-700"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Why Trust Us ──────────────────────────────────── */}
      <section
        className="bg-white dark:bg-slate-900
                   border-y border-slate-100 dark:border-slate-800
                   transition-colors duration-300"
      >
        <div className="mx-auto max-w-6xl px-6 py-28 lg:px-16
                        flex flex-col gap-16 lg:flex-row-reverse lg:items-center lg:gap-24">
          {/* text */}
          <motion.div
            className="flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <SectionLabel>Our commitments</SectionLabel>
            <AccentTitle>Why Trust Us</AccentTitle>

            <motion.ul
              className="space-y-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
              }}
            >
              {trustPoints.map((pt, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-4"
                  variants={{
                    hidden: { opacity: 0, x: 24 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center
                                  rounded-xl bg-amber-50 dark:bg-amber-500/10
                                  text-amber-500 dark:text-amber-400 font-bold text-base"
                  >
                    {pt.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {pt.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {pt.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* image */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.img
              src={WhyTrustUs}
              alt="Why Trust Us"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-sm rounded-3xl object-cover shadow-2xl
                         ring-1 ring-slate-200 dark:ring-slate-700"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px]
                        rounded-full bg-amber-400/10 dark:bg-amber-500/5 blur-3xl"
        />

        <div className="mx-auto max-w-6xl px-6 py-28 lg:px-16
                        flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
          {/* text */}
          <motion.div
            className="flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <SectionLabel>How it started</SectionLabel>
            <AccentTitle>Our Story</AccentTitle>

            <div className="space-y-5">
              {visibleStory.map((para, i) => (
                <motion.p
                  key={i}
                  className="leading-relaxed text-slate-500 dark:text-slate-400"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* fade mask + button */}
            <div className="relative mt-6">
              {!expanded && (
                <div
                  className="pointer-events-none absolute -top-16 left-0 right-0 h-16
                                bg-gradient-to-b from-transparent
                                to-slate-50 dark:to-slate-950"
                />
              )}
              <motion.button
                onClick={() => setExpanded((p) => !p)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="mt-2 inline-flex items-center gap-2 rounded-xl border
                           border-slate-200 dark:border-slate-700
                           bg-white dark:bg-slate-800
                           px-6 py-2.5 text-sm font-semibold
                           text-slate-700 dark:text-slate-200
                           shadow-sm hover:shadow-md
                           transition-shadow duration-200 cursor-pointer"
              >
                {expanded ? "Show Less" : "Read More"}
                <span
                  className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                >
                  ↓
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* image — sticky on large screens */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end lg:sticky lg:top-28"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.img
              src={OurStoryImg}
              alt="Our Story"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-sm rounded-3xl object-cover shadow-2xl
                         ring-1 ring-slate-200 dark:ring-slate-700"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;