import { GameReviewContent } from './game-review-content'



export default async function GameContentReview({ params }: { params: { gameId: string } }) {
  return (
    <GameReviewContent gameId={params.gameId} />
  )
}

