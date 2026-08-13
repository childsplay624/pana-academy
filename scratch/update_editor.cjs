const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/admin/PageEditor.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// --- Replace Left Panel ---
// The left panel starts at:
const leftPanelStart = content.indexOf('{/* Left Panel: Sidebar Controls (Inspector) */}');
const leftPanelEnd = content.indexOf('{/* Section Editor Content */}');
const closeMapIndex = content.indexOf('</CardContent>\n                                  </motion.div>\n                                )}\n                              </AnimatePresence>\n                            </Card>\n                          );\n                        })}\n                      </div>\n                    )}');
const afterCloseMap = closeMapIndex !== -1 ? closeMapIndex + 372 : -1; // roughly where it ends

if (leftPanelStart === -1 || leftPanelEnd === -1) {
  console.error("Could not find left panel bounds");
  process.exit(1);
}

// Get the form fields block
const formFieldsStart = content.indexOf('{/* Common Logic Based on Type */}');
const formFieldsEnd = content.lastIndexOf('</div>\n                                    </CardContent>\n                                  </motion.div>\n                                )}\n                              </AnimatePresence>\n                            </Card>');

if (formFieldsStart === -1 || formFieldsEnd === -1) {
    console.error("Could not find form fields bounds", formFieldsStart, formFieldsEnd);
    process.exit(1);
}

const formFields = content.substring(formFieldsStart, formFieldsEnd);

const newLeftPanel = `                {/* Left Panel: Sidebar Controls (Inspector) */}
                <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar border-r border-border/50 bg-background/50 backdrop-blur-sm z-20 shadow-xl lg:shadow-none h-full pb-10">
                  
                  {!activeSectionId ? (
                    // OUTLINE MODE
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between mb-4 px-2">
                        <div>
                          <h3 className="font-black text-lg tracking-tight">Page Sections</h3>
                          <p className="text-xs text-muted-foreground">Reorder or add new blocks</p>
                        </div>
                        <Button variant="default" size="sm" className="h-9 shadow-md hover:scale-105 transition-transform" onClick={() => setIsAddSectionOpen(true)}>
                          <Plus className="w-4 h-4 mr-1" /> Add
                        </Button>
                      </div>

                      {sections.length === 0 ? (
                        <div className="text-center p-8 bg-muted/20 rounded-2xl border-2 border-dashed mx-2">
                          <Layout className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-4">No sections added yet.</p>
                          <Button onClick={() => setIsAddSectionOpen(true)} variant="outline">Browse Library</Button>
                        </div>
                      ) : (
                        <div className="space-y-2 px-2">
                          {sections.map((section, index) => (
                            <div 
                              key={section.id} 
                              className="group flex items-center justify-between bg-card hover:bg-primary/5 border border-border/50 hover:border-primary/30 p-3 rounded-xl cursor-pointer transition-all hover:shadow-sm"
                              onClick={() => setActiveSectionId(section.id)}
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <GripVertical className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 cursor-grab active:cursor-grabbing flex-shrink-0" />
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Layout className="w-4 h-4 text-primary" />
                                </div>
                                <div className="truncate">
                                  <h4 className="font-bold text-sm truncate">{section.content.title || section.section_type.replace(/_/g, ' ')}</h4>
                                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wider mt-0.5">{section.section_type}</Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => moveSection(index, 'up')} disabled={index === 0}>
                                  <MoveUp className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}>
                                  <MoveDown className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => deleteSection(section.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // INSPECTOR MODE
                    <div className="space-y-6 pt-2 px-2 pb-10">
                      {(() => {
                        const section = sections.find(s => s.id === activeSectionId);
                        if (!section) return null;
                        
                        return (
                          <AnimatePresence mode="wait">
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }} 
                              animate={{ opacity: 1, x: 0 }} 
                              exit={{ opacity: 0, x: -20 }}
                              key={section.id}
                            >
                              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted shrink-0" onClick={() => setActiveSectionId(null)}>
                                  <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="truncate">
                                  <h3 className="font-bold text-lg capitalize truncate">{section.section_type.replace(/_/g, ' ')}</h3>
                                  <p className="text-xs text-muted-foreground">Editing section properties</p>
                                </div>
                              </div>

                              <CardContent className="p-0 border-none shadow-none bg-transparent">
                                <div className="grid grid-cols-1 gap-4">
${formFields}
                                </div>
                              </CardContent>
                            </motion.div>
                          </AnimatePresence>
                        );
                      })()}
                    </div>
                  )}

                  <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                    <DialogContent className="max-w-4xl sm:rounded-[2rem] h-[80vh] flex flex-col">
                      <DialogHeader className="pb-2 flex-shrink-0">
                         <DialogTitle className="text-2xl font-black italic">Section Library</DialogTitle>
                         <DialogDescription>Add high-conversion blocks to build your custom page.</DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="mb-4">
                            <TabsTrigger value="basic">Standard Blocks</TabsTrigger>
                            <TabsTrigger value="dynamic">Dynamic Components</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="basic" className="mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {[
                                { type: 'hero', icon: Layout, title: 'Hero Banner', desc: 'Main title & CTA' },
                                { type: 'content', icon: Type, title: 'Text Block', desc: 'Article content' },
                                { type: 'features', icon: CheckSquare, title: 'Features Grid', desc: 'Value propositions' },
                                { type: 'testimonials', icon: MessageSquare, title: 'User Reviews', desc: 'Social proof' },
                                { type: 'faq', icon: HelpCircle, title: 'FAQ Accordion', desc: 'Common questions' },
                                { type: 'cta', icon: MousePointer2, title: 'Action Bridge', desc: 'Closing conversion' },
                                { type: 'stats', icon: Layout, title: 'Stats Counter', desc: 'Impact numbers' },
                                { type: 'team', icon: MessageSquare, title: 'Team Grid', desc: 'Team members' },
                                { type: 'banner', icon: AlertCircle, title: 'Promo Banner', desc: 'Announcement strip' },
                              ].map(item => (
                                <div 
                                  key={item.type} 
                                  className="bg-muted/30 p-6 rounded-3xl border-2 border-transparent hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
                                  onClick={() => addSection(item.type)}
                                >
                                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                    <item.icon className="w-6 h-6 text-primary" />
                                  </div>
                                  <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                                  <p className="text-[10px] text-muted-foreground leading-tight">{item.desc}</p>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="dynamic" className="mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {[
                                { type: 'dynamic_hero', icon: Layout, title: 'Home Hero', desc: 'Main home banner' },
                                { type: 'dynamic_stats', icon: TrendingUp, title: 'Home Stats', desc: 'Home overlap stats' },
                                { type: 'dynamic_how_it_works', icon: Layout, title: 'How It Works', desc: 'Home steps' },
                                { type: 'dynamic_categories', icon: Layout, title: 'Categories', desc: 'Course counts' },
                                { type: 'dynamic_features', icon: Layout, title: 'Platform Features', desc: 'Home features' },
                                { type: 'dynamic_top_courses', icon: Layout, title: 'Top Courses', desc: 'Top rated courses' },
                                { type: 'dynamic_upcoming_courses', icon: Layout, title: 'Upcoming Courses', desc: 'Upcoming courses' },
                                { type: 'dynamic_news', icon: Layout, title: 'Latest News', desc: 'Recent blog posts' },
                                { type: 'dynamic_testimonials', icon: MessageSquare, title: 'Home Reviews', desc: 'Home testimonials' },
                              ].map(item => (
                                <div 
                                  key={item.type} 
                                  className="bg-blue-50/50 p-6 rounded-3xl border-2 border-transparent hover:border-blue-400/40 hover:bg-blue-50 transition-all cursor-pointer group"
                                  onClick={() => addSection(item.type)}
                                >
                                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                    <item.icon className="w-6 h-6 text-blue-500" />
                                  </div>
                                  <h4 className="font-bold text-sm mb-1 text-blue-900">{item.title}</h4>
                                  <p className="text-[10px] text-blue-700/70 leading-tight">{item.desc}</p>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
`;

// Now construct the final file
const startToReplace = content.indexOf('{/* Left Panel: Sidebar Controls (Inspector) */}');
const endToReplace = content.indexOf('{/* Right Panel: Live Visual Canvas */}');

if (startToReplace === -1 || endToReplace === -1) {
    console.error("Could not find start/end to replace");
    process.exit(1);
}

const finalContent = content.substring(0, startToReplace) + newLeftPanel + "\n" + content.substring(endToReplace);
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('Update successful');
