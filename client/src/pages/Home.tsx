"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Carousel } from "@/components/ui/carousel"
import { Avatar } from "@/components/ui/avatar"

import movie1Image from "@/assets/joker.png"
import movie2Image from "@/assets/harry_potter_and_the_sorcerers_stone.png"
import movie3Image from "@/assets/spider_man_homecoming.png"

// Sample data (usually fetched from an API)
const mediaData = [
  { id: 1, title: "joker", image: movie1Image },
  { id: 2, title: "harry_potter_and_the_soccerers_stone", image: movie2Image },
  { id: 3, title: "spider_man_home_comming", image: movie3Image },
  { id: 4, title: "joker", image: movie1Image },
  { id: 5, title: "harry_potter_and_the_soccerers_stone", image: movie2Image },
  { id: 6, title: "example title", image: "https://via.placeholder.com/150" },
  { id: 7, title: "example title", image: "https://via.placeholder.com/150" },
  { id: 8, title: "example title", image: "https://via.placeholder.com/150" },
  { id: 9, title: "example title", image: "https://via.placeholder.com/150" },
  { id: 10, title: "example title", image: "https://via.placeholder.com/150" },
  { id: 11, title: "example title", image: "https://via.placeholder.com/150" },
  { id: 12, title: "example title", image: "https://via.placeholder.com/150" },
]

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // You could add a real search API call here
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Avatar */}
      <div className="flex justify-end mb-4">
        <Avatar className="rounded-full">
          <img src={movie1Image} alt="User Avatar" />
        </Avatar>
      </div>

      {/* Search Box */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex items-center justify-center">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Movies, TV Shows..."
            className="w-1/2"
          />
          <Button type="submit" className="ml-4">
            Search
          </Button>
        </form>
      </div>

      {/* Carousels */}
      <div className="space-y-8">
        {/* Popular Movies Carousel */}
        <div>
          <Label htmlFor="popularMovies">Popular Movies</Label>
          <Carousel className="flex space-x-4 overflow-x-auto">
            {mediaData.map((item) => (
              <Card key={item.id} className="w-36 flex-shrink-0">
                <img src={item.image} alt={item.title} className="rounded-md" />
                <h3 className="text-center mt-2 truncate">{item.title}</h3>
              </Card>
            ))}
          </Carousel>
        </div>

        {/* Recommended TV Shows Carousel */}
        <div>
          <Label htmlFor="recommendedTVShows">For You</Label>
          <Carousel className="flex space-x-4 overflow-x-auto">
            {mediaData.map((item) => (
              <Card key={item.id} className="w-36 flex-shrink-0">
                <img src={item.image} alt={item.title} className="rounded-md" />
                <h3 className="text-center mt-2 truncate">{item.title}</h3>
              </Card>
            ))}
          </Carousel>
        </div>

        {/* Similar Carousels for other categories can be added similarly */}
      </div>
    </div>
  )
}
