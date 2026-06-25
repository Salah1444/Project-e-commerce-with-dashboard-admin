import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "@/store/productsSlice"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-toastify"
import Loading from "@/components/Loading"
import { useLocation } from "react-router-dom"
import { fetchReviews, UpdateRatingReveiw } from "@/store/reviewsSlice"

const RATINGS = [1, 2, 3, 4, 5]

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between text-sm text-slate-700 dark:text-slate-50">
    <span>{label}</span>
    <span>{value || "—"}</span>
  </div>
)

export default function AdminReviews() {
  const dispatch = useDispatch()
  const { id } = useLocation().state

  const { loading } = useSelector((s) => s.products)
  const products = useSelector((s) => s.products.allProducts)
  const { reviews } = useSelector((s) => s.reviews)
  const product = products?.find((p) => p._id === id)

  const [reviewRatings, setReviewRatings] = useState({})
  const [savingId, setSavingId] = useState(null)

  useEffect(() => { if (!products?.length) dispatch(fetchProducts()) }, [])
  useEffect(() => { dispatch(fetchReviews(id)) }, [id])

  const handleSave = async (reviewId) => {
    const rating = reviewRatings[reviewId]
    if (!rating || rating < 1 || rating > 5) return toast.error("Rating must be between 1 and 5")
    setSavingId(reviewId)
    await dispatch(UpdateRatingReveiw({ rating, id: reviewId }))
    setSavingId(null)
  }

  if (loading || !product) return <Loading />

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Product Detail</h2>

      {/* Product Info */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-[300px_1fr]">
          <img
            src={`http://localhost:5000/uploads/products/${product.image}`}
            alt={product.name}
            className="h-72 w-full object-cover rounded-xl border border-border/50"
          />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <h4 className="text-sm font-semibold mb-1">Product Details</h4>
              {[
                ["Category", product.category?.name || "Uncategorized"],
                ["Price", `${product.price} DH`],
                ["Stock", product.stock],
                ["SKU", product.sku],
                ["Brand", product.brand],
                ["Warranty", product.warranty],
              ].map(([label, value]) => <DetailRow key={label} label={label} value={value} />)}
              <div className="flex justify-between text-sm pt-2 border-t">
                <span>Rating</span>
                <span>{product.rating ? "⭐".repeat(Math.round(product.rating)) : "No rating"}</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">Description</h4>
              <p className="text-sm text-slate-600 dark:text-slate-50 leading-6">
                {product.description || "No description available."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Reviews ({reviews?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews?.length ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review._id} className="border-border/50 bg-slate-50 dark:bg-slate-950">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold">{review?.user?.FullName}</p>
                        <p className="text-xs text-muted-foreground">{review?.user?.Email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium">Rating:</label>
                        <Select
                          value={String(reviewRatings[review._id] ?? review.rating ?? 1)}
                          onValueChange={(v) => setReviewRatings((p) => ({ ...p, [review._id]: Number(v) }))}
                        >
                          <SelectTrigger className="w-20 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Rating</SelectLabel>
                              {RATINGS.map((v) => <SelectItem key={v} value={String(v)}>{v} ⭐</SelectItem>)}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="text-xs h-8"
                          disabled={savingId === review._id}
                          onClick={() => handleSave(review._id)}
                        >
                          {savingId === review._id ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-200">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">Stored rating: {review.rating ?? 0}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-slate-600">
              No reviews yet for this product.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}