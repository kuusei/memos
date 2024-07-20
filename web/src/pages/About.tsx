import { Link } from "@mui/joy";
import Icon from "@/components/Icon";
import MobileHeader from "@/components/MobileHeader";

const About = () => {
  return (
    <section className="@container w-full max-w-5xl min-h-full flex flex-col justify-start items-center sm:pt-3 md:pt-6 pb-8">
      <MobileHeader />
      <div className="w-full px-4 sm:px-6 flex flex-col gap-4">
        <div className="w-full shadow flex flex-col justify-start items-start px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-gray-300">
          <a href="https://www.usememos.com" className="flex items-center gap-1" target="_blank">
            <img className="w-auto h-10 rounded-full" src="https://www.usememos.com/logo.png" alt="memos" />
            <span className="text-2xl">momos</span>
          </a>
          <p className="text-base">A privacy-first, lightweight note-taking service. Easily capture and share your great thoughts.</p>
          <div className="mt-1 flex flex-row items-center flex-wrap">
            <Link underline="always" href="https://www.github.com/usememos/memos" target="_blank">
              GitHub Repo
            </Link>
            <Icon.Dot className="w-4 h-auto opacity-60" />
            <Link underline="always" href="https://www.usememos.com/" target="_blank">
              Official Website
            </Link>
            <Icon.Dot className="w-4 h-auto opacity-60" />
            <Link underline="always" href="https://www.usememos.com/blog" target="_blank">
              Blogs
            </Link>
            <Icon.Dot className="w-4 h-auto opacity-60" />
            <Link underline="always" href="https://www.usememos.com/docs" target="_blank">
              Documents
            </Link>
          </div>
        </div>
        <div className="w-full shadow flex flex-col justify-start items-start px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-gray-300">
          <a href="https://github.com/kuusei/memos" className="flex items-center gap-1" target="_blank">
            <img className="w-auto h-10" src="./logo.webp" alt="kuusei/memos" />
            <span className="text-2xl">kuusei/momos</span>
          </a>
          <p className="text-base">一个 memos 的分叉</p>
          <iframe
            style={{ width: "100%", height: "auto", minHeight: "475px" }}
            src="https://link.kuusei.moe/momos-changelog-embed"
            frameBorder="0"
          ></iframe>
          <div className="mt-1 flex flex-row items-center flex-wrap">
            <Link underline="always" href="https://github.com/kuusei/memos" target="_blank">
              GitHub Repo
            </Link>
            <Icon.Dot className="w-4 h-auto opacity-60" />
            <Link underline="always" href="https://link.kuusei.moe/momos-changelog" target="_blank">
              变更内容
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
