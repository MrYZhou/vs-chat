const path = require('path')
const os = require('os')
const fs = require('fs')
import axios from 'axios'
const baseUrl: string = 'http://127.0.0.1:8083'

export class Base {

    static sourceDir: string = path.resolve(__dirname, '..', 'environment')
    static targetDir: string = path.resolve(os.homedir(), '.autopub')

    static init() {
        let isExit = fs.existsSync(this.targetDir);
        if (!isExit) {
            this.copyFolder(this.sourceDir, this.targetDir)
        }

    }
    static join(...params: any[]) {
        let url = path.join(...params)
        return url
    }
    // 复制文件夹
    static copyFolder = (srcDir: string, tarDir: string, cb?: Function) => {
        let isExit = fs.existsSync(tarDir);
        if (!isExit) {
            fs.mkdirSync(tarDir, 777);
        }
        //readdir只能读取基于这个sourceDir下的那一级文件和文件夹
        fs.readdir(srcDir, function (err: any, files: any[]) {
            if (err) {
                return;
            }
            files.forEach((file) => {
                let srcPath = path.join(srcDir, file);
                let tarPath = path.join(tarDir, file);

                fs.stat(srcPath, (err: any, stats: { isDirectory: () => any }) => {
                    if (err) {
                        return;
                    }
                    if (stats.isDirectory()) {
                        fs.existsSync(tarPath)
                            ? Base.copyFolder(srcPath, tarPath)
                            : fs.mkdirSync(tarPath, 777) && Base.copyFolder(srcPath, tarPath);
                    } else {
                        Base.copyFile(srcPath, tarPath);
                    }
                });
            });

            //为空时直接回调
            files.length === 0 && cb && cb();
        });
    };
    // 复制文件,前提是文件夹存在
    static copyFile = function (
        srcPath: any,
        tarPath: any,
        cb?: ((arg0: any) => any) | undefined
    ) {
        let rs = fs.createReadStream(srcPath);
        rs.on("error", function (err: any) {
            if (err) {
                console.log("read error", srcPath);
            }
            cb && cb(err);
        });

        let ws = fs.createWriteStream(tarPath);
        ws.on("error", function (err: any) {
            if (err) {
                console.log("write error", tarPath);
            }
            cb && cb(err);
        });
        ws.on("close", function (ex: any) {
            cb && cb(ex);
        });

        rs.pipe(ws);
    };

    // 初始化文件夹,某个文件路径中间文件夹不存在就生成,只用于文件
    // 也可以理解创建上一级的目录
    static mkdirs = (tarDir: string) => {
        return new Promise((resolve) => {
            let dir = path.resolve(tarDir, "../");
            if (tarDir && !fs.existsSync(dir)) {
                Base.mkdirs(dir);
                fs.mkdirSync(dir, 777);
            }
            resolve(1);
        });
    };
    static writeLog(data: string) {
        this.writeFile(path.join(this.targetDir, 'autopub.log'), data)
    }
    static writeFile(path: string, data: string) {
        fs.writeFile(path, data, {
            encoding: "utf8",
            flag: "a",
        }, (err: any) => {
            if (err) { throw err; }
        });
    }
    static readFile(path: string) {
        const data = fs.readFileSync(path, 'UTF-8').toString()
        return JSON.parse(data)
    }
    static getAllFilesOfDir(dir: any) {
        let files: any[] = [];
        fs.readdirSync(dir).forEach((file: any) => {
            const filePath = path.join(dir, file);
            const fileStat = fs.statSync(filePath);
            if (fileStat.isFile() && !filePath.endsWith('map')) {
                files.push(filePath);
            } else if (fileStat.isDirectory()) {
                files = files.concat(Base.getAllFilesOfDir(filePath));
            }
        });
        return files;
    }
    static time(label: string) {
        console.time(label)
    }

    static timeEnd(label: string) {
        console.timeEnd(label)
    }

    static tip(msg: any) {
        console.log(msg);
    }
    

}
export const get = async (url: string) => {
    try {
        let response = await axios.get(baseUrl + url)
        return response.data
    } catch (error) {
        console.log(error);
    }

};

export const post = async (url: string, data: any) => {
    try {
        let response = await axios.post(baseUrl + url, data)
        return response.data
    } catch (error) {
        console.log(error);
    }

};
