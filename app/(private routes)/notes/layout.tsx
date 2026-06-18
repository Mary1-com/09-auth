// import css from "./LayoutNotes.module.css";

// interface NotesLayoutProps { children: React.ReactNode; modal: React.ReactNode; }

// export default function NotesLayout({ children, modal }: NotesLayoutProps) {
//     return (
//         <section className={css.container}>
//             {children}
//             {modal}
//         </section>
//     );
// }

import css from "./LayoutNotes.module.css";

interface NotesLayoutProps {
    children: React.ReactNode;
}

export default function NotesLayout({ children }: NotesLayoutProps) {
    return <section className={css.container}>{children}</section>;
}