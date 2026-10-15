import AppKit
import Foundation
// Use the user's current vector mark verbatim; never substitute the retired diamond.
let output=CommandLine.arguments[1]
let source=CommandLine.arguments.count>2 ? CommandLine.arguments[2] : "assets/prism-mark.svg"
guard let mark=NSImage(contentsOfFile:source) else {fatalError("Missing Prism vector mark")}
try FileManager.default.createDirectory(atPath:output,withIntermediateDirectories:true)
for size in [16,32,128,256,512] {for scale in [1,2] {
 let pixels=size*scale
 let bitmap=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:pixels,pixelsHigh:pixels,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:0,bitsPerPixel:0)!
 NSGraphicsContext.saveGraphicsState();NSGraphicsContext.current=NSGraphicsContext(bitmapImageRep:bitmap)
 let factor=CGFloat(pixels)/1024
 NSColor.white.setFill();NSBezierPath(roundedRect:NSRect(x:32*factor,y:32*factor,width:960*factor,height:960*factor),xRadius:220*factor,yRadius:220*factor).fill()
 mark.draw(in:NSRect(x:92*factor,y:92*factor,width:840*factor,height:840*factor),from:.zero,operation:.sourceOver,fraction:1)
 NSGraphicsContext.restoreGraphicsState()
 let name="icon_\(size)x\(size)"+(scale==2 ? "@2x" : "")+".png"
 try bitmap.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:output).appendingPathComponent(name))
}}
