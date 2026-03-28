import { Toaster } from "react-hot-toast"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import LibraryBookUploadForm from "./pages/create/create-pdf.page"
import LibraryListing from "./pages/listing/listing.page"
import BookViewPage from "./pages/view/view.page"
import RootLayout from "./layouts/root.layout"


function App() {

  const display = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<LibraryListing />} />
      <Route path="upload" element={<LibraryBookUploadForm />} />
      <Route path="/:id" element={<BookViewPage />} />
    </Route>
  ))

  return (
    <>
      <Toaster position="bottom-center" />
      <RouterProvider router={display} />
    </>
  );
}

export default App
