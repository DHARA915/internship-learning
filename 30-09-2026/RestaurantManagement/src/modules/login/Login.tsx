import { useState } from "react";
import {
  MotionConfig,
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { Loader2, UtensilsCrossed, ArrowRight } from "lucide-react";
import { FormField } from "../../components/form-field/FormField.tsx";
import {loginUser} from "./auth.ts";
import { useNavigate } from "react-router-dom";
// import {user} from "../../data/logindata.ts";
import { useDispatch } from "react-redux";
import {setCurrentUser} from "../../Redux/Slices/authSlice.ts";
import type { AppDispatch } from "../../Redux/store.ts";
import {RESTAURANT_NAME, HEADLINE, SUBTEXT} from "../../utils/restaurantCommon.ts";


const list: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [liveErrors, setLiveErrors] = useState<
    Record<string, string | undefined>
  >({});

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [imgFailed, setImgFailed] = useState(false);

  const handleChange = (value: unknown, name: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors(({ [name]: _removed, ...rest }) => rest);
    setServerError("");
  };

  const handleValidate = (
    error: string | undefined,
    name: string
  ) => {
    setLiveErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const next: Record<string, string> = {};

    if (!values.email) {
      next.email = "Email is required";
    }

    if (!values.password) {
      next.password = "Password is required";
    }

    if (
      Object.keys(next).length > 0 ||
      Object.values(liveErrors).some(Boolean)
    ) {
      setErrors(next);
      return;
    }
    try {
      setLoading(true);
      setServerError("");

      const user = loginUser(values.email, values.password);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      dispatch(
        setCurrentUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        })
      );

      navigate(user.role === "admin" ? "/admin/dashboard" : "/user/home", {
        replace: true,
      });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Sign in failed. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
}

  return (
    <MotionConfig reducedMotion="user">
      <main className="h-dvh overflow-hidden bg-background p-2 sm:p-3 lg:p-4">
        <div
          className="
            mx-auto
            flex
            h-full
            w-full
            max-w-7xl
            overflow-hidden
            rounded-xl
            sm:rounded-2xl
            bg-primary
            shadow-2xl
            lg:grid
            justify-center
            lg:grid-cols-[1.05fr_0.95fr]
          "
        >
          {/* =====================================================
              LEFT BRAND PANEL
          ====================================================== */}

          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              hidden
              overflow-hidden
              md:block
              lg:block
            "
          >
            {!imgFailed && (
              <motion.img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0T-8bsswuPaf_OiquFZceDX20AU_mC19kE3shqiN5ew1w6Gdd3xAeb-1N&s=10"
                alt=""
                onError={() => setImgFailed(true)}
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 1.3,
                  ease: "easeOut",
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/20 to-brand/60" />

            {/* Decorative circles */}
            <div className="absolute -right-32 -top-32 size-96 rounded-full border border-white/10" />
            <div className="absolute -bottom-40 -left-40 size-[30rem] rounded-full border border-white/10" />

            <div className="relative z-10 flex h-full flex-col justify-between p-7 xl:p-10">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 text-white"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-button-primary">
                  <UtensilsCrossed
                    className="size-4"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {RESTAURANT_NAME}
                  </p>

                  <p className="text-[11px] text-white/60">
                    Restaurant Management
                  </p>
                </div>
              </motion.div>

              {/* Main content */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={list}
                className="max-w-lg"
              >
                <motion.div variants={item}>
                  <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                    Restaurant Admin Portal
                  </span>
                </motion.div>

                <motion.h1
                  variants={item}
                  className="
                    text-3xl
                    font-semibold
                    leading-[1.08]
                    tracking-tight
                    text-white
                    xl:text-5xl
                    2xl:text-6xl
                  "
                >
                  {HEADLINE}
                </motion.h1>

                <motion.p
                  variants={item}
                  className="
                    mt-4
                    max-w-md
                    text-sm
                    leading-5
                    text-white/70
                    xl:text-base
                  "
                >
                  {SUBTEXT}
                </motion.p>

                <motion.div
                  variants={item}
                  className="mt-6 flex items-center gap-2 text-xs font-medium text-white"
                >
                  <span className="size-1.5 rounded-full bg-brand" />
                  Everything you need to run today's service.
                </motion.div>
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-[10px] text-white/50"
              >
                © 2026 {RESTAURANT_NAME}. All rights reserved.
              </motion.p>
            </div>
          </motion.section>

          {/* =====================================================
              RIGHT LOGIN PANEL
          ====================================================== */}

          <motion.section
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              flex
              h-full
              min-h-0
              items-center
              justify-center
              overflow-hidden
              bg-primary
              px-5
              py-4
              sm:px-8
              sm:py-6
              md:px-10
              lg:px-10
              xl:px-14
            "
          >
            <motion.div
              variants={list}
              initial="hidden"
              animate="show"
              className="w-full max-w-md "
            >
              {/* Mobile logo */}
              <motion.div
                variants={item}
                className="
                  mb-5
                  flex
                  items-center
                  gap-2.5
                  xl:gap-5
                  md:hidden
                "
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-button-primary text-on-brand">
                  <UtensilsCrossed className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-primary">
                    {RESTAURANT_NAME}
                  </p>

                  <p className="text-[11px] text-tertiary">
                    Restaurant Management
                  </p>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.div variants={item}>
                <p className="mb-1 text-xs font-medium text-brand">
                  Welcome back
                </p>

                <h2 className="lg:text-2xl xl:text-4xl font-semibold tracking-tight text-primary sm:text-3xl">
                  Sign in to your account
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-secondary sm:text-sm">
                  Access your orders, tables, kitchen and restaurant
                  operations.
                </p>
              </motion.div>

              {/* Server error */}
              <AnimatePresence>
                {serverError && (
                  <motion.div
                    role="alert"
                    initial={{
                      opacity: 0,
                      height: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: -5,
                    }}
                    className="
                      mt-3
                      overflow-hidden
                      rounded-lg
                      border
                      border-danger/30
                      bg-danger/10
                      px-3
                      py-2
                      text-xs
                      text-danger
                    "
                  >
                    {serverError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-5 space-y-4 sm:mt-6"
              >
                {/* Email */}
                <motion.div variants={item}>
                  <FormField
                    type="email"
                    name="email"
                    label="Email"
                    required
                    value={values.email}
                    onChange={handleChange}
                    onValidate={handleValidate}
                    error={errors.email}
                  />
                </motion.div>

                {/* Password */}
                <motion.div variants={item}>
                  <FormField
                    type="password"
                    name="password"
                    label="Password"
                    required
                    validate={false}
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                </motion.div>

                {/* Remember + Forgot */}
                <motion.div
                  variants={item}
                  className="flex items-center justify-between gap-3"
                >
                  <FormField
                    type="checkbox"
                    name="remember"
                    label="Remember me"
                    value={values.remember}
                    onChange={handleChange}
                  />

                  <a
                    href="/forgot-password"
                    className="
                      text-xs
                      font-medium
                      text-brand
                      transition-colors
                      hover:text-brand-hover
                      sm:text-sm
                    "
                  >
                    Forgot password?
                  </a>
                </motion.div>

                {/* Submit */}
                <motion.div variants={item} className="pt-0.5">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={
                      loading
                        ? undefined
                        : {
                            y: -1,
                          }
                    }
                    whileTap={
                      loading
                        ? undefined
                        : {
                            scale: 0.98,
                          }
                    }
                    className="
                      group
                      inline-flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-button-primary
                      px-5
                      text-sm
                      font-semibold
                      text-primary
                      shadow-lg
                      shadow-brand/20
                      transition-colors
                      hover:bg-button-primary-hover
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {loading && (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}

                    <span>
                      {loading ? "Signing in..." : "Sign in"}
                    </span>

                    {!loading && (
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div
                variants={item}
                className="my-5 xl:my-2 flex items-center gap-3 sm:my-6"
              >
                <div className="h-px flex-1 bg-border" />

                <span className="text-[10px] text-tertiary">
                  Secure access
                </span>

                <div className="h-px flex-1 bg-border" />
              </motion.div>

              {/* Footer */}
              <motion.p
                variants={item}
                className="
                  text-center
                  text-[10px]
                  leading-4
                  text-tertiary
                  sm:text-xs
                  sm:leading-5
                "
              >
                Trouble signing in? Ask your manager to reset
                your access.
              </motion.p>

              <motion.p
                variants={item}
                className="mt-2 text-center text-[9px] text-tertiary sm:text-[11px]"
              >
                Authorized restaurant staff only.
              </motion.p>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </MotionConfig>
  );
}

