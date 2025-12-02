import React, { useState } from 'react';
import { GridVisualizer } from './components/GridVisualizer';
import { ChatInterface } from './components/ChatInterface';
import { TutorialStage, GridState } from './types';
import { BookOpen, Code, Play, AlertTriangle, ChevronRight, LayoutGrid } from 'lucide-react';

const INITIAL_GRID: GridState = {
  rows: 4,
  cols: 5,
  data: [
    [4, 4, 3, 1, 4],
    [3, 1, 1, 1, 1],
    [4, 3, 4, 1, 2],
    [4, 4, 2, 2, 2]
  ]
};

const STAGES = [
  { id: TutorialStage.INTRO, title: '任务概览', icon: BookOpen },
  { id: TutorialStage.DATA_STRUCTURE, title: '数据结构', icon: LayoutGrid },
  { id: TutorialStage.ALGORITHM_LOGIC, title: '逻辑陷阱', icon: AlertTriangle },
  { id: TutorialStage.SIMULATION, title: '运行模拟', icon: Play },
  { id: TutorialStage.CODE_HINTS, title: '代码实现', icon: Code },
];

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<TutorialStage>(TutorialStage.INTRO);
  const [gridData, setGridData] = useState<GridState>(INITIAL_GRID);

  const renderContent = () => {
    switch (currentStage) {
      case TutorialStage.INTRO:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">消除类游戏 C语言教程</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              欢迎来到这个编程挑战。你的目标是编写一个 C 语言程序来模拟一个益智游戏。
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="font-bold text-blue-900 mb-2">游戏规则</h3>
              <ul className="list-disc list-inside space-y-2 text-blue-800">
                <li>输入：一个 <code>N x M</code> 的数字网格 (1-9)。</li>
                <li>匹配：在行或列中，有3个或更多连续相同的数字。</li>
                <li>操作：将所有匹配的数字替换为 <code>0</code>。</li>
                <li><strong>关键：</strong>所有匹配项同时消除。</li>
              </ul>
            </div>
            <p className="text-slate-600">
              查看下面的示例网格。你能找出匹配项吗？
            </p>
            <GridVisualizer initialGrid={gridData} showSimulation={false} />
          </div>
        );

      case TutorialStage.DATA_STRUCTURE:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">第1步：存储棋盘</h2>
            <p className="text-slate-600">
              在解决逻辑问题之前，我们需要存储数据。在 C 语言中，最适合表示网格的结构是<strong>二维数组</strong>。
            </p>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-sm shadow-inner">
              <p>// 你将如何声明一个 N x M 大小的网格？</p>
              <p>int grid[100][100]; <span className="text-slate-500">// 假设最大尺寸为 100</span></p>
              <p>int n, m;</p>
              <p>scanf("%d %d", &n, &m);</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-bold text-yellow-800 flex items-center gap-2">
                <AlertTriangle size={18}/> 提问时间：
              </h4>
              <p className="text-yellow-700 mt-1">
                你如何遍历网格中的每一个单元格？（提示：使用嵌套循环）。
              </p>
            </div>
          </div>
        );

      case TutorialStage.ALGORITHM_LOGIC:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">第2步：逻辑陷阱</h2>
            <p className="text-slate-600">
              这是大多数初学者容易出错的地方。再读一遍规则：<em>“所有匹配项同时消除”</em>。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                 <h3 className="font-bold text-red-800 mb-2">错误的方法</h3>
                 <p className="text-red-700 text-sm">
                   如果你在第1行找到了一个水平匹配并立即将其设置为0，那么稍后检查列时会发生什么？
                 </p>
                 <p className="mt-2 text-red-900 font-semibold text-sm">
                   你破坏了垂直检查所需的数据！
                 </p>
               </div>
               
               <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                 <h3 className="font-bold text-green-800 mb-2">正确的方法</h3>
                 <p className="text-green-700 text-sm">
                   我们需要先<strong>标记</strong>要删除的单元格，而不是立即修改原始网格。
                 </p>
                 <p className="mt-2 text-green-900 font-semibold text-sm">
                   解决方案：使用一个标记数组（例如 <code>int marks[N][M]</code>），并初始化为0。
                 </p>
               </div>
            </div>
          </div>
        );

      case TutorialStage.SIMULATION:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">第3步：可视化算法</h2>
            <p className="text-slate-600">
              让我们看看“先标记后删除”策略的实际效果。
              <br/>
              1. 程序扫描所有行。
              <br/>
              2. 程序扫描所有列。
              <br/>
              3. 只有在完成所有扫描之后，我们才将被标记的单元格变为0。
            </p>
            
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
               <GridVisualizer initialGrid={gridData} showSimulation={true} />
            </div>
            
            <p className="text-sm text-slate-500 text-center">
              点击“模拟消除”来观察整个过程。
            </p>
          </div>
        );

      case TutorialStage.CODE_HINTS:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">第4步：实现提示</h2>
            <p className="text-slate-600">
              现在你已经准备好编写代码了。这是伪代码结构：
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                <span className="bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded text-xs mt-1">1</span>
                <div>
                  <h4 className="font-semibold text-slate-800">输入</h4>
                  <p className="text-slate-600 text-sm">读取 N, M。将网格数据读入 <code>A[N][M]</code>。</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                <span className="bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded text-xs mt-1">2</span>
                <div>
                  <h4 className="font-semibold text-slate-800">水平扫描</h4>
                  <p className="text-slate-600 text-sm">
                    循环 <code>i</code> 从 0 到 N-1。<br/>
                    循环 <code>j</code> 从 0 到 M-3。<br/>
                    如果 <code>A[i][j] == A[i][j+1] == A[i][j+2]</code>，则在另一个数组 <code>B[N][M]</code> 中将这些位置标记为1。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                <span className="bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded text-xs mt-1">3</span>
                <div>
                  <h4 className="font-semibold text-slate-800">垂直扫描</h4>
                  <p className="text-slate-600 text-sm">
                    与水平扫描类似，但循环 <code>i</code> 到 N-3。比较 <code>A[i][j]</code> 和 <code>A[i+1][j]</code>...
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                <span className="bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded text-xs mt-1">4</span>
                <div>
                  <h4 className="font-semibold text-slate-800">最终更新</h4>
                  <p className="text-slate-600 text-sm">
                    遍历网格。如果 <code>B[i][j] == 1</code>，则设置 <code>A[i][j] = 0</code>。然后打印数组 <code>A</code>。
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm z-10">
        <div className="mb-8 flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <Code className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">C语言导师</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = currentStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setCurrentStage(stage.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                <span>{stage.title}</span>
                {isActive && <ChevronRight size={16} className="ml-auto opacity-50"/>}
              </button>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-100">
           <p className="text-xs text-slate-400 text-center">
             实验指导书 P143 (6)
           </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Tutorial Content */}
          <div className="xl:col-span-2 space-y-8">
            {renderContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-slate-200 mt-8">
               <button 
                 disabled={STAGES.findIndex(s => s.id === currentStage) === 0}
                 onClick={() => {
                   const idx = STAGES.findIndex(s => s.id === currentStage);
                   if(idx > 0) setCurrentStage(STAGES[idx-1].id);
                 }}
                 className="px-4 py-2 text-slate-600 font-medium hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
               >
                 &larr; 上一步
               </button>
               <button 
                 disabled={STAGES.findIndex(s => s.id === currentStage) === STAGES.length - 1}
                 onClick={() => {
                   const idx = STAGES.findIndex(s => s.id === currentStage);
                   if(idx < STAGES.length - 1) setCurrentStage(STAGES[idx+1].id);
                 }}
                 className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-30 shadow-sm transition-all"
               >
                 下一步 &rarr;
               </button>
            </div>
          </div>

          {/* AI Tutor Sidebar */}
          <div className="xl:col-span-1">
             <div className="sticky top-6">
                <ChatInterface />
                <div className="mt-4 p-4 bg-blue-50 rounded-xl text-xs text-blue-700 leading-relaxed border border-blue-100">
                  <strong>提示：</strong>你可以向 AI 询问 C 语言语法（例如，“如何写 for 循环？”），但请先尝试自己解决核心逻辑！
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;