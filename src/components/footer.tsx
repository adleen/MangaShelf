import { BookHeart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <BookHeart className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            by{' '}
            <a
              href="https://github.com/adleen"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              adleen
            </a>
          </p>
        </div>
        <p className="text-center text-sm leading-loose text-muted-foreground">
          Built with{' '}
          <a
            href="https://firebase.google.com/studio"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Firebase Studio
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
