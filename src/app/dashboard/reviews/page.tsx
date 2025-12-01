// src/app/(dashboard)/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, Star, ThumbsUp, ThumbsDown, MessageSquare, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface Review {
  id: string;
  movieId: string;
  movieTitle: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  likes: number;
  dislikes: number;
  repliesCount: number;
  verifiedWatched: boolean;
  status: 'ACTIVE' | 'HIDDEN' | 'DELETED';
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockData: Review[] = [
        {
          id: '1',
          movieId: 'm1',
          movieTitle: 'Avatar: The Way of Water',
          userId: 'u1',
          userName: 'Nguyen Van A',
          rating: 5,
          content: 'Phim rất hay, hình ảnh đẹp mắt, nội dung cảm động. Đáng xem!',
          likes: 45,
          dislikes: 3,
          repliesCount: 8,
          verifiedWatched: true,
          status: 'ACTIVE',
          createdAt: '2025-01-10T14:30:00',
        },
        {
          id: '2',
          movieId: 'm2',
          movieTitle: 'The Batman',
          userId: 'u2',
          userName: 'Tran Thi B',
          rating: 4,
          content: 'Phim hay nhưng hơi dài. Diễn xuất tốt, đạo diễn khéo léo.',
          likes: 28,
          dislikes: 5,
          repliesCount: 3,
          verifiedWatched: true,
          status: 'ACTIVE',
          createdAt: '2025-01-11T16:20:00',
        },
        {
          id: '3',
          movieId: 'm3',
          movieTitle: 'Spider-Man: No Way Home',
          userId: 'u3',
          userName: 'Le Van C',
          rating: 3,
          content: 'Tạm được, không hay lắm. CGI quá nhiều.',
          likes: 12,
          dislikes: 18,
          repliesCount: 15,
          verifiedWatched: false,
          status: 'ACTIVE',
          createdAt: '2025-01-09T11:15:00',
        },
      ];
      setReviews(mockData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
      setDeleteDialogOpen(false);
      fetchReviews();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
      toast({
        title: 'Success',
        description: `Review ${newStatus.toLowerCase()} successfully`,
      });
      fetchReviews();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review status',
        variant: 'destructive',
      });
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      filterRating === 'all' || review.rating === parseInt(filterRating);

    const matchesStatus =
      filterStatus === 'all' || review.status.toLowerCase() === filterStatus;

    return matchesSearch && matchesRating && matchesStatus;
  });

  const stats = {
    total: reviews.length,
    average: (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1),
    positive: reviews.filter((r) => r.rating >= 4).length,
    negative: reviews.filter((r) => r.rating <= 2).length,
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews & Ratings</h1>
        <p className="text-gray-500 mt-1">Manage customer feedback and reviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-yellow-600">{stats.average}</div>
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Positive Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.positive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Negative Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.negative}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reviews by movie, user, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">Loading...</CardContent>
          </Card>
        ) : filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              No reviews found
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <Avatar className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                      {review.userName.charAt(0)}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.userName}</span>
                        {review.verifiedWatched && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Verified Purchase
                          </Badge>
                        )}
                        <Badge
                          className={
                            review.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {review.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {review.movieTitle} • {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </p>
                      {renderStars(review.rating)}
                      <p className="mt-3 text-gray-700">{review.content}</p>
                      <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                        <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          {review.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                          <ThumbsDown className="h-4 w-4" />
                          {review.dislikes}
                        </button>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {review.repliesCount} replies
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(review.id, review.status)}
                      className={review.status === 'ACTIVE' ? 'text-gray-600' : 'text-green-600'}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedReview(review);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}