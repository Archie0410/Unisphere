import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, DollarSign, Search, Filter, GraduationCap } from "lucide-react";
import { searchUniversities, University } from "@/data/universities";

const UniversitySearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<University[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results = searchUniversities(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-4">
          Search Universities
        </h2>
        <p className="text-purple-200 text-lg">
          Find your perfect university by name, location, or program
        </p>
      </div>

      {/* Search Input */}
      <Card className="bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by university name, location, or program..."
                className="pl-10 h-12 border-purple-400/40 bg-white/70 text-purple-800 placeholder:text-purple-600/70 focus:bg-white transition-colors"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="h-12 px-8 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 border-0"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-purple-300">
              Search Results ({searchResults.length} universities found)
            </h3>
            <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
              <Filter className="h-3 w-3 mr-1" />
              Filter Results
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {searchResults.map((university) => (
              <Card 
                key={university.id} 
                className="bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-lg hover:shadow-purple-400/30 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/university/${university.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-xl font-semibold text-purple-800">{university.name}</h4>
                        <Badge variant="outline" className="border-purple-400/40 text-purple-700 bg-white/60">
                          {university.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-purple-700 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {university.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {university.rating} ({university.totalReviews} reviews)
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(university.tuitionFee)}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-medium text-purple-800 mb-2">Popular Programs:</h5>
                        <div className="flex flex-wrap gap-2">
                          {university.programs.slice(0, 3).map((program, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-purple-400/40 text-purple-700 bg-white/60">
                              {program}
                            </Badge>
                          ))}
                          {university.programs.length > 3 && (
                            <Badge variant="outline" className="text-xs border-purple-400/40 text-purple-700 bg-white/60">
                              +{university.programs.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-purple-700">NIRF Rank: <span className="font-semibold text-purple-800">#{university.nirf_rank}</span></span>
                        <span className="text-purple-700">Acceptance: <span className="font-semibold text-purple-800">{university.acceptance}</span></span>
                        <span className="text-purple-700">Placement: <span className="font-semibold text-purple-800">{university.placement_rate}%</span></span>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-purple-400/40 text-purple-700 hover:bg-purple-300/30 bg-white/60"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <Card className="bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-2xl">
          <CardContent className="p-12 text-center">
            <Search className="h-16 w-16 mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-purple-800 mb-2">No Universities Found</h3>
            <p className="text-purple-700 mb-4">
              No universities match your search criteria. Try different keywords or browse all universities.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
            >
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Search Suggestions */}
      {!searchQuery && searchResults.length === 0 && (
        <Card className="bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-purple-800">Quick Search Suggestions</CardTitle>
            <CardDescription className="text-purple-700">
              Try searching for popular universities or programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "IIT Delhi",
                "Delhi University", 
                "Computer Science",
                "Engineering",
                "Bangalore",
                "Mumbai",
                "Medicine",
                "Business"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="text-xs h-8 border-purple-400/40 text-purple-700 hover:bg-purple-300/30 bg-white/60"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UniversitySearch;
