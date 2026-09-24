"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import Button from "@/components/ui/Button/Button";
import styles from "./Hero.module.css";
import buttonStyles from "@/components/ui/Button/Button.module.css";
import ContactModal from "@/components/ContactModal/ContactModal";
import AboutModal from "@/components/AboutModal/AboutModal";

export default function Hero() {
  const { translate, locale } = useTranslations();

  const [contactOpen, setContactOpen] = useState(false)
  const [aboutContent, setAboutContent] = useState<string | null>(null);

  async function openAbout() {
    const response = await fetch(`/api/about?locale=${locale}`);
    if (!response.ok) return;
    const data = await response.json();
    setAboutContent(data.content);
  }

  return (
    <section className={styles.hero}>
      <div className={styles.profile}>
        <div className={styles.profilePicture}>
          <Image
            src="/andrea.png"
            alt={translate.landing.altImg}
            width={400}
            height={400}
            priority
          />
        </div>

        <div className={styles.info}>
          <div className={styles.name}>
            <h1>Andrea Larrumbide</h1>

            <h2 className={styles.title}>
              {translate.landing.title}
            </h2>
          </div>

          <p className={styles.profileInfo}>
            {translate.landing.description}
          </p>

          <div className={styles.buttons}>
            <Button variant="secondary" onClick={openAbout}>
              {translate.landing.about}
            </Button>
            {aboutContent !== null && <AboutModal
              title={translate.landing.about}
              content={aboutContent}
              onClose={() => setAboutContent(null)}
            />}
            <Button variant="primary"
              onClick={() => setContactOpen(true)}>
              {translate.landing.contact}
            </Button>
            {contactOpen && (
              <ContactModal
              onClose={() => setContactOpen(false)}
              />
            )}

            <Link
              href="/illustrations"
              className={`${buttonStyles.button} ${buttonStyles.secondary}`}
            >
              {translate.landing.viewPortfolio}
            </Link>
            <Link
              href="/photos"
              className={`${buttonStyles.button} ${buttonStyles.secondary}`}
            >
              {translate.landing.viewPhotos}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
