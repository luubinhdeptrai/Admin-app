// src/app/(dashboard)/movies/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Film as FilmIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import type { Movie } from '@/types';
import Image from 'next/image';

import { mockMovies } from '@/lib/mockData'; // ⭐️ Import mock data


export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterUrl: '',
    trailerUrl: '',
    genres: [] as string[],
    durationMinutes: 0,
    ageRating: '',
    releaseDate: '',
    status: 'NOW_SHOWING',
  });
  const { toast } = useToast();

  const genreOptions = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Adventure', 'Fantasy'];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      /*
      setLoading(true);
      const response = await api.get('/movies');
      setMovies(response.data);
      */

       setLoading(true);
            
            // ⭐️ PHẦN THAY THẾ
            await new Promise(resolve => setTimeout(resolve, 500)); 
            setMovies(mockMovies); 
            // ⭐️ KẾT THÚC PHẦN THAY THẾ
            
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch movies',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedMovie) {
        await api.patch(`/movies/${selectedMovie.id}`, formData);
        toast({ title: 'Success', description: 'Movie updated successfully' });
      } else {
        await api.post('/movies', formData);
        toast({ title: 'Success', description: 'Movie created successfully' });
      }
      setDialogOpen(false);
      fetchMovies();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save movie',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedMovie) return;
    try {
      await api.delete(`/movies/${selectedMovie.id}`);
      toast({ title: 'Success', description: 'Movie deleted successfully' });
      setDeleteDialogOpen(false);
      fetchMovies();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete movie',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      posterUrl: '',
      trailerUrl: '',
      genres: [],
      durationMinutes: 0,
      ageRating: '',
      releaseDate: '',
      status: 'NOW_SHOWING',
    });
    setSelectedMovie(null);
  };

  const openEditDialog = (movie: Movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description || '',
      posterUrl: movie.posterUrl || '',
      trailerUrl: movie.trailerUrl || '',
      genres: movie.genres,
      durationMinutes: movie.durationMinutes,
      ageRating: movie.ageRating || '',
      releaseDate: movie.releaseDate,
      status: movie.status,
    });
    setDialogOpen(true);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOW_SHOWING':
        return 'bg-green-100 text-green-700';
      case 'COMING_SOON':
        return 'bg-blue-100 text-blue-700';
      case 'ENDED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movies</h1>
          <p className="text-gray-500 mt-1">Manage your movie catalog</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Movie
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">Loading...</div>
        ) : filteredMovies.length === 0 ? (
          <div className="col-span-full text-center py-12">No movies found</div>
        ) : (
          filteredMovies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-96 bg-gray-100">
                {movie.posterUrl ? (
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FilmIcon className="h-16 w-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(movie)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMovie(movie);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1">{movie.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {movie.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{movie.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Rating:</span>
                    <span className="font-medium">{movie.ageRating || 'N/A'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {movie.genres.slice(0, 3).map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Badge className={getStatusColor(movie.status)}>
                      {movie.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMovie ? 'Edit Movie' : 'Add New Movie'}
            </DialogTitle>
            <DialogDescription>
              Fill in the movie details below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Avatar: The Way of Water"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter movie description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="posterUrl">Poster URL</Label>
                <Input
                  id="posterUrl"
                  value={formData.posterUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, posterUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trailerUrl">Trailer URL</Label>
                <Input
                  id="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, trailerUrl: e.target.value })
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duration (mins) *</Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })
                  }
                  placeholder="120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ageRating">Age Rating</Label>
                <Input
                  id="ageRating"
                  value={formData.ageRating}
                  onChange={(e) =>
                    setFormData({ ...formData, ageRating: e.target.value })
                  }
                  placeholder="PG-13"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="releaseDate">Release Date *</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, releaseDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOW_SHOWING">Now Showing</SelectItem>
                  <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                  <SelectItem value="ENDED">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Genres *</Label>
              <div className="flex flex-wrap gap-2">
                {genreOptions.map((genre) => (
                  <Button
                    key={genre}
                    type="button"
                    variant={formData.genres.includes(genre) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        genres: formData.genres.includes(genre)
                          ? formData.genres.filter((g) => g !== genre)
                          : [...formData.genres, genre],
                      });
                    }}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {selectedMovie ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Movie</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete `${selectedMovie?.title}`?
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