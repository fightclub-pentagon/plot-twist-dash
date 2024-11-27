export interface Character {
  id: number
  name: string
  image: string
  overview: string
  backstory: string
  is_killer: boolean
}

export interface GameCard {
  id: number
  title: string
  image: string
  text: string
  order_number: number
}

export interface Game {
  id: number
  title: string
  image: string
  presentation_text: string
  conclusion: string
  created_at: string
  updated_at: string
  created_by: string
  language: string
  n_of_cards: number
  n_of_characters: number
  public: boolean
}

export interface GameReviewData {
  game: Game
  characters: Character[]
  cards: GameCard[]
  rules: string
} 