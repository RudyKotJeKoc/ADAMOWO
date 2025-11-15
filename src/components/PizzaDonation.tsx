import { motion } from 'framer-motion';
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export function PizzaDonation() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-base-950 via-base-900 to-base-950 py-20">
      {/* Animated background sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-accent-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container-responsive relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          {/* Pizza emoji with floating animation */}
          <motion.div
            className="mb-8 text-center"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-8xl drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              🍕
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            className="mb-6 text-center text-4xl font-bold md:text-5xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent">
              {t('donation.title')}
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="mb-8 text-center text-lg text-base-200 md:text-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {t('donation.description')}
          </motion.p>

          {/* Donation card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <motion.div
              className="card-base group relative overflow-hidden border border-accent-400/20 bg-gradient-to-br from-base-900/50 to-base-950/50 p-8 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-400/0 via-accent-400/10 to-accent-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                {/* Features list */}
                <div className="mb-8 grid gap-4 md:grid-cols-2">
                  {[
                    { icon: HeartIcon, key: 'feature1' },
                    { icon: SparklesIcon, key: 'feature2' },
                    { icon: HeartIcon, key: 'feature3' },
                    { icon: SparklesIcon, key: 'feature4' },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.key}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      <item.icon className="h-6 w-6 flex-shrink-0 text-accent-400" />
                      <span className="text-base-100">
                        {t(`donation.${item.key}`)}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.a
                    href="https://www.paypal.com/paypalme/daremonnl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-lg bg-gradient-to-r from-accent-500 to-accent-400 px-8 py-4 text-lg font-bold text-base-950 shadow-lg shadow-accent-500/30 transition-all hover:shadow-xl hover:shadow-accent-500/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />

                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-2xl">🍕</span>
                      {t('donation.cta')}
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.a>

                  <p className="mt-4 text-sm text-base-400">
                    {t('donation.subtitle')}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom message */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            <p className="text-base-300">
              {t('donation.thanks')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
