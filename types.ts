type Game = {
    characters: Array<Character>;
    created_at: string;
    created_by: string;
    id: number;
    image: string;
    language: string;
    n_of_cards: number;
    n_of_characters: number;
    presentation_text: string;
    public: boolean;
    rules: string;
    title: string;
    updated_at: string;
};

type Character = {
  image: string;
  name: string;
};