"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useParams, useNavigate } from "react-router-dom"

import movie1Image from "@/assets/joker.png"
import movie2Image from "@/assets/harry_potter_and_the_sorcerers_stone.png"

// Mock Media Data for Example
const mediaData = [
  {
    id: "1",
    title: "Joker",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt ducimus atque optio accusantium! Pariatur perspiciatis temporibus minima nesciunt nobis, in non commodi maiores laborum nulla libero inventore nam quia aliquid.",
    image: movie1Image,
    genres: ["Psychological", "Drama", "Thriller"],
    releaseDate: "2019-10-04",
    rating: "10/10",
    type: "Movie",
  },
  {
    id: "2",
    title: "TV Show 1",
    description: "A gripping drama about family secrets and political intrigue.",
    image: movie2Image,
    genres: ["Drama", "Mystery"],
    releaseDate: "2023-09-15",
    rating: "9.1/10",
    type: "TV Show",
  },
]

export const MediaDetailPage = () => {
  const { id } = useParams() // Get `id` from route params
  const navigate = useNavigate()

  // Find media by `id`
  const media = mediaData.find((item) => item.id === id)

  if (!media) {
    return (
      <div className="container mx-auto text-center py-10">
        <h2>Media Not Found</h2>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="link" onClick={() => navigate(-1)}>
        &larr; Back to List
      </Button>

      {/* Media Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image Section */}
        <div>
          <img
            src={media.image}
            alt={media.title}
            className="rounded-md shadow-lg w-full"
          />
        </div>

        {/* Details Section */}
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-4">{media.title}</h1>

          <div className="space-y-4">
            <p>
              <Label>Description:</Label> {media.description}
            </p>
            <p>
              <Label>Type:</Label> {media.type}
            </p>
            <p>
              <Label>Genres:</Label> {media.genres.join(", ")}
            </p>
            <p>
              <Label>Release Date:</Label> {media.releaseDate}
            </p>
            <p>
              <Label>Rating:</Label> {media.rating}
            </p>
          </div>

          {/* Watch Button */}
          <div className="mt-6 space-x-8">
            <Button className="w-full md:w-auto">Favorite</Button>
            <Button className="w-full md:w-auto">Review</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
