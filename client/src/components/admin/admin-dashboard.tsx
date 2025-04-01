import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getApiKeys, createOrUpdateApiKey, deleteApiKey, getLanguages, createLanguage, updateLanguage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Loader2, Plus, Eye, EyeOff, Copy, Check, Trash, Edit, Users, MessageSquare, Globe, Headset } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AdminDashboard() {
  const { toast } = useToast();
  const [showApiKeyValue, setShowApiKeyValue] = useState<Record<number, boolean>>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<{ id?: number; provider: string; keyValue: string; isActive: boolean }>({
    provider: '',
    keyValue: '',
    isActive: true
  });
  const [editingLanguage, setEditingLanguage] = useState<{ id?: number; name: string; code: string; isActive: boolean; region?: string }>({
    name: '',
    code: '',
    isActive: true,
    region: 'Kenya'
  });

  // Fetch API keys
  const { 
    data: apiKeys = [], 
    isLoading: isLoadingApiKeys 
  } = useQuery({
    queryKey: ['/api/admin/api-keys'],
    queryFn: getApiKeys
  });

  // Fetch languages
  const { 
    data: languages = [], 
    isLoading: isLoadingLanguages 
  } = useQuery({
    queryKey: ['/api/admin/languages'],
    queryFn: getLanguages
  });

  // Create or update API key
  const apiKeyMutation = useMutation({
    mutationFn: (data: { provider: string; keyValue: string; isActive: boolean }) => {
      return createOrUpdateApiKey(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/api-keys'] });
      setEditDialogOpen(false);
      setEditingApiKey({ provider: '', keyValue: '', isActive: true });
      toast({
        title: "Success",
        description: "API key saved successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save API key",
        variant: "destructive"
      });
    }
  });

  // Delete API key
  const deleteApiKeyMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteApiKey(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/api-keys'] });
      toast({
        title: "Success",
        description: "API key deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete API key",
        variant: "destructive"
      });
    }
  });

  // Create language
  const createLanguageMutation = useMutation({
    mutationFn: (data: { name: string; code: string; isActive: boolean; region?: string }) => {
      return createLanguage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/languages'] });
      setLanguageDialogOpen(false);
      setEditingLanguage({ name: '', code: '', isActive: true, region: 'Kenya' });
      toast({
        title: "Success",
        description: "Language created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create language",
        variant: "destructive"
      });
    }
  });

  // Update language
  const updateLanguageMutation = useMutation({
    mutationFn: (data: { id: number; data: { name?: string; code?: string; isActive?: boolean; region?: string } }) => {
      return updateLanguage(data.id, data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/languages'] });
      setLanguageDialogOpen(false);
      setEditingLanguage({ name: '', code: '', isActive: true, region: 'Kenya' });
      toast({
        title: "Success",
        description: "Language updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update language",
        variant: "destructive"
      });
    }
  });

  const toggleShowApiKey = (id: number) => {
    setShowApiKeyValue(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key copied to clipboard"
    });
  };

  const handleEditApiKey = (apiKey: { id: number; provider: string; keyValue: string; isActive: boolean }) => {
    setEditingApiKey(apiKey);
    setEditDialogOpen(true);
  };

  const handleSaveApiKey = () => {
    apiKeyMutation.mutate(editingApiKey);
  };

  const handleDeleteApiKey = (id: number) => {
    if (window.confirm("Are you sure you want to delete this API key?")) {
      deleteApiKeyMutation.mutate(id);
    }
  };

  const handleEditLanguage = (language: { id: number; name: string; code: string; isActive: boolean; region?: string }) => {
    setEditingLanguage(language);
    setLanguageDialogOpen(true);
  };

  const handleSaveLanguage = () => {
    if (editingLanguage.id) {
      // Update existing language
      const { id, ...rest } = editingLanguage;
      updateLanguageMutation.mutate({ id, data: rest });
    } else {
      // Create new language
      createLanguageMutation.mutate(editingLanguage);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Users</h3>
                <p className="text-2xl font-bold">2,845</p>
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                  <path d="m18 15-6-6-6 6"></path>
                </svg>
                8.2%
              </span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-600 bg-opacity-10 flex items-center justify-center text-purple-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Conversations</h3>
                <p className="text-2xl font-bold">14,372</p>
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                  <path d="m18 15-6-6-6 6"></path>
                </svg>
                12.5%
              </span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-orange-500 bg-opacity-10 flex items-center justify-center text-orange-500">
                <Globe className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm">Languages Supported</h3>
                <p className="text-2xl font-bold">{languages.length}</p>
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1 inline">
                  <path d="M12 5v14"></path>
                  <path d="M5 12h14"></path>
                </svg>
                2 in development
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center text-green-500">
                <Headset className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm">API Status</h3>
                <p className="text-2xl font-bold">Healthy</p>
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                99.9% uptime
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="languages">Language Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="stats">Usage Statistics</TabsTrigger>
        </TabsList>
        
        {/* API Configuration Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">API Keys</CardTitle>
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => setEditingApiKey({ provider: '', keyValue: '', isActive: true })}
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingApiKey.id ? 'Edit API Key' : 'Add New API Key'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="provider">Provider</Label>
                      <Input
                        id="provider"
                        placeholder="E.g., gemini, openai, custom"
                        value={editingApiKey.provider}
                        onChange={(e) => setEditingApiKey({ ...editingApiKey, provider: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="keyValue">API Key</Label>
                      <Input
                        id="keyValue"
                        type="password"
                        placeholder="Enter API key"
                        value={editingApiKey.keyValue}
                        onChange={(e) => setEditingApiKey({ ...editingApiKey, keyValue: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={editingApiKey.isActive}
                        onCheckedChange={(checked) => 
                          setEditingApiKey({ ...editingApiKey, isActive: checked as boolean })
                        }
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveApiKey} disabled={apiKeyMutation.isPending}>
                      {apiKeyMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingApiKeys ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No API keys configured yet. Add your first API key to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map(apiKey => (
                    <div key={apiKey.id} className="p-4 border dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-lg">{apiKey.provider}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${apiKey.isActive ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                          {apiKey.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center mt-2">
                        <Input
                          type={showApiKeyValue[apiKey.id] ? "text" : "password"}
                          value={apiKey.keyValue}
                          className="flex-1"
                          readOnly
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleShowApiKey(apiKey.id)}
                          className="ml-2"
                        >
                          {showApiKeyValue[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(apiKey.keyValue)}
                          className="ml-1"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditApiKey(apiKey)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Language Management Tab */}
        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">Languages</CardTitle>
              <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setEditingLanguage({ name: '', code: '', isActive: true, region: 'Kenya' })}
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Language
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingLanguage.id ? 'Edit Language' : 'Add New Language'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Language Name</Label>
                      <Input
                        id="name"
                        placeholder="E.g., Maasai"
                        value={editingLanguage.name}
                        onChange={(e) => setEditingLanguage({ ...editingLanguage, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="code">Language Code</Label>
                      <Input
                        id="code"
                        placeholder="E.g., mas"
                        value={editingLanguage.code}
                        onChange={(e) => setEditingLanguage({ ...editingLanguage, code: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        placeholder="E.g., Kenya"
                        value={editingLanguage.region}
                        onChange={(e) => setEditingLanguage({ ...editingLanguage, region: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="languageActive"
                        checked={editingLanguage.isActive}
                        onCheckedChange={(checked) => 
                          setEditingLanguage({ ...editingLanguage, isActive: checked as boolean })
                        }
                      />
                      <Label htmlFor="languageActive">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setLanguageDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveLanguage}
                      disabled={createLanguageMutation.isPending || updateLanguageMutation.isPending}
                    >
                      {createLanguageMutation.isPending || updateLanguageMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingLanguages ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : languages.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No languages configured yet. Add your first language to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Code</th>
                        <th className="p-4 font-medium">Region</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-800">
                      {languages.map(language => (
                        <tr key={language.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-4 font-medium">{language.name}</td>
                          <td className="p-4">{language.code}</td>
                          <td className="p-4">{language.region || '-'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${language.isActive ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                              {language.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditLanguage(language)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>User management features are coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Usage Statistics Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Maasai</span>
                      <span className="text-sm font-medium">43%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '43%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Kiswahili</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Kikuyu</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Luo</span>
                      <span className="text-sm font-medium">9%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '9%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Other</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Text Chat</span>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Voice Input</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Document Translation</span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Handwriting Input</span>
                      <span className="text-sm font-medium">3%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Side-by-Side View</span>
                      <span className="text-sm font-medium">2%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
