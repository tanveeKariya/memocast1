import { FilterIcon, GridIcon, ListIcon, ShareIcon } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface TrademarkResult {
  id: string;
  logo?: string;
  serialNumber: string;
  date: string;
  status: string;
  filingDate: string;
  description: string;
  viewed?: number;
  shared?: number;
  saved?: number;
  markName: string;
  ownerName: string;
}

interface Filters {
  status: string[];
  owners: string[];
  classes: string[];
  view: 'grid' | 'list';
}

export const Box = (): JSX.Element => {
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'no-results' | 'error'>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TrademarkResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<TrademarkResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    status: [],
    owners: [],
    classes: [],
    view: 'list'
  });

  const statusOptions = [
    { id: 'registered', label: 'Registered', count: 3 },
    { id: 'pending', label: 'Pending', count: 1 }
  ];

  const ownerOptions = [
    { id: 'owner1', label: 'Liam Price - Attorney', count: 2 },
    { id: 'owner2', label: 'Search Owners', count: 1 }
  ];

  const classOptions = [
    { id: 'class1', label: 'LITIGATION MISC', count: 3 },
    { id: 'class2', label: 'Special File', count: 2 }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchStatus('searching');
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/trademark-search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      const results = response.data.map((item: any) => ({
        id: item.id || String(Math.random()),
        serialNumber: item.serialNumber || '',
        date: item.filingDate || '',
        status: item.status || 'Unknown',
        filingDate: item.filingDate || '',
        description: item.description || '',
        markName: item.markName || searchQuery.toUpperCase(),
        ownerName: item.ownerName || 'Unknown Owner',
        viewed: Math.floor(Math.random() * 30),
        shared: Math.floor(Math.random() * 10),
        saved: Math.floor(Math.random() * 15),
      }));

      setSearchResults(results);
      setFilteredResults(results);
      setTotalResults(results.length);
      setSearchStatus(results.length > 0 ? 'idle' : 'no-results');
    } catch (error) {
      console.error('Search error:', error);
      setSearchStatus('error');
      setSearchResults([]);
      setFilteredResults([]);
    }
  };

  const handleFilterChange = (type: keyof Filters, value: string) => {
    const newFilters = { ...filters };
    
    if (type === 'view') {
      newFilters.view = value as 'grid' | 'list';
    } else {
      const index = newFilters[type].indexOf(value);
      if (index === -1) {
        newFilters[type].push(value);
      } else {
        newFilters[type].splice(index, 1);
      }
    }
    
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: Filters) => {
    let results = [...searchResults];
    
    if (currentFilters.status.length > 0) {
      results = results.filter(result => 
        currentFilters.status.some(status => 
          result.status.toLowerCase().includes(status.toLowerCase())
        )
      );
    }
    
    if (currentFilters.owners.length > 0) {
      results = results.filter(result =>
        currentFilters.owners.some(owner =>
          result.ownerName.toLowerCase().includes(owner.toLowerCase())
        )
      );
    }
    
    setFilteredResults(results);
    setTotalResults(results.length);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Trademark Search Results',
        text: `Check out these trademark results for "${searchQuery}"`,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };

  const handleFilter = () => {
    // Reset all filters
    setFilters({
      status: [],
      owners: [],
      classes: [],
      view: filters.view
    });
    setFilteredResults(searchResults);
  };

  const renderSearchStatus = () => {
    switch (searchStatus) {
      case 'searching':
        return (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-600">Searching...</span>
          </div>
        );
      case 'no-results':
        return (
          <div className="text-center py-4 text-gray-600">
            No results found for "{searchQuery}"
          </div>
        );
      case 'error':
        return (
          <div className="text-center py-4 text-red-600">
            An error occurred while searching. Please try again.
          </div>
        );
      default:
        return null;
    }
  };

  const suggestedSearches = ['nike', 'inc', 'tech', 'global'];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-3">
        <div className="container flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-blue-600 font-bold text-xl">Trademarkia</h1>
          </div>
          <div className="flex items-center space-x-2 w-1/2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search Trademarks like e.g. Nike or iPhone"
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                variant="default"
                className="absolute right-0 top-0 h-full rounded-l-none"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-6 flex-1">
        {renderSearchStatus()}
        
        {filteredResults.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm text-gray-600">
              About {totalResults} Trademarks found for "{searchQuery}"
            </h2>
          </div>
        )}

        <div className="flex gap-6">
          {/* Filters sidebar */}
          <div className="w-64 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Status</h3>
                <div className="space-y-2">
                  {statusOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={filters.status.includes(option.id)}
                        onCheckedChange={() => handleFilterChange('status', option.id)}
                      />
                      <Label htmlFor={option.id} className="flex items-center">
                        <Badge
                          variant="outline"
                          className={`${
                            option.id === 'registered'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-yellow-50 text-yellow-600'
                          } mr-2`}
                        >
                          {option.label}
                        </Badge>
                        <span className="text-sm">{option.count}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Owners</h3>
                <div className="space-y-2">
                  {ownerOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={filters.owners.includes(option.id)}
                        onCheckedChange={() => handleFilterChange('owners', option.id)}
                      />
                      <Label htmlFor={option.id} className="text-sm">
                        <span>{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Classes</h3>
                <div className="space-y-2">
                  {classOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={filters.classes.includes(option.id)}
                        onCheckedChange={() => handleFilterChange('classes', option.id)}
                      />
                      <Label htmlFor={option.id} className="text-sm">
                        <span>{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Display</h3>
                <RadioGroup
                  value={filters.view}
                  onValueChange={(value) => handleFilterChange('view', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grid" id="grid" />
                    <Label htmlFor="grid" className="flex items-center">
                      <GridIcon className="h-4 w-4 mr-2" />
                      <span>Grid View</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="list" id="list" />
                    <Label htmlFor="list" className="flex items-center">
                      <ListIcon className="h-4 w-4 mr-2" />
                      <span>List View</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Results table */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Also try searching for
                </span>
                {suggestedSearches.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => {
                      setSearchQuery(term);
                      handleSearch();
                    }}
                  >
                    {term}
                  </Button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleFilter}>
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6">Mark</TableHead>
                  <TableHead className="w-1/4">Details</TableHead>
                  <TableHead className="w-1/6">Status</TableHead>
                  <TableHead>Class/Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center border border-gray-200 rounded">
                          <img
                            src="/page-1.svg"
                            alt={record.markName}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{record.markName}</p>
                        <p className="text-xs text-gray-500">{record.ownerName}</p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">SN:</span>{" "}
                          {record.serialNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Filed:</span>{" "}
                          {record.date}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-600"
                        >
                          {record.status}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Filed:</span>{" "}
                          {record.filingDate}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <p className="text-sm">{record.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Viewed {record.viewed}
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Shared {record.shared}
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Saved {record.saved}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};