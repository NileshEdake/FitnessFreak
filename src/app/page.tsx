import Image from "next/image";
import styles from "./page.module.css";
import HomeBanner1 from "./components/HomeBanner1/HomeBanner1";
import HomeBanner2 from "./components/HomeBanner2/HomeBanner2";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
       <HomeBanner1/>
       <HomeBanner2/>
       
      
      </main>
     
    </div>
  );
}
