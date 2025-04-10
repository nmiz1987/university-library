import { signOut } from '@/auth';
import BookList from '@/components/BookList';
import { Button } from '@/components/ui/button';
import { sampleBooks } from '@/constants';

export default function page() {
  return (
    <>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
        className="mb-10"
      >
        <Button className="text-black">Logout</Button>
      </form>
      <BookList title="Borrowed books" books={sampleBooks} containerClassName="mb-10" />
    </>
  );
}
