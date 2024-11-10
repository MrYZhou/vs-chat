import * as vscode from 'vscode';
import * as path from 'path';
import { Uri } from 'vscode';

module.exports = class ChatWebview {
    async registe(context: vscode.ExtensionContext) {
        // 显示按钮
        const myButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        myButton.tooltip = "Open Chat";
        myButton.text = `$(comment-discussion)`
        myButton.color = 'white';
        myButton.command = 'autopub.chatPanel';
        myButton.show();
        let extensionUri = vscode.extensions.getExtension('larry.autopub')?.extensionUri;
        let panel: vscode.WebviewPanel

        let chatPanel = vscode.commands.registerCommand('autopub.chatPanel', async () => {
            // 创建一个新的 WebView 视图
            panel = vscode.window.createWebviewPanel('myChatWebView', '电影助手',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [
                        vscode.Uri.file(path.join(context.extensionPath, 'out/view2')),
                    ],
                }
            );

            // 注册消息监听器来接收来自webview的消息
            panel.webview.onDidReceiveMessage(async event => {
                console.log(event);
            });

            // 在 WebView 视图中加载 HTML 内容
            panel.webview.html = await getWebviewHTML(panel, extensionUri ?? Uri.file(''));

            // webview销毁函数
            panel.onDidDispose(() => {
                console.log('panel onDidDispose')
            })

        })
        context.subscriptions.push(chatPanel);


    }
    deactivate() {
    }
}
// 获取目录下文件信息
async function listFilesInDirectory(uri: vscode.Uri): Promise<any> {
    try {
        // 使用vscode.workspace.fs.readDirectory来获取目录内容
        const entries = await vscode.workspace.fs.readDirectory(uri) as any;

        let map = {} as any
        entries.map((entry: string[]) => {
            if (entry[0].includes('css')) {
                map['css'] = vscode.Uri.joinPath(uri, entry[0])
            }
            if (entry[0].includes('js')) {
                map['js'] = vscode.Uri.joinPath(uri, entry[0])
            }
        });

        return map;
    } catch (error) {
        console.error(`Failed to read directory: ${error}`);
        return [];
    }
}

async function getWebviewHTML(panel: vscode.WebviewPanel, extensionUri: Uri): Promise<string> {
    let res = await listFilesInDirectory(vscode.Uri.joinPath(extensionUri, 'out', 'view2', 'assets'))
    // js地址动态转换
    const scriptUri = panel.webview.asWebviewUri(res['js']);
    // css地址动态转换
    const styleUri = panel.webview.asWebviewUri(res['css']);

    return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <base target="_top" href="/"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script type="module" crossorigin src="${scriptUri}"></script>
      <link rel="stylesheet" href="${styleUri}">
    </head>
    <body>
      <div id="root"></div>
      
    </body>
    <style>
        .Navbar {
            opacity:0!important;
            margin-top:-20px;
        }
    </style>
  </html>
  `;
}
