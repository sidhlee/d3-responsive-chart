# d3-responsive-chart

This repository is based on https://webkid.io/blog/responsive-chart-usability-d3/

Some modifications are made to work with V5+

## Code Structure
1. **`labels`**: Dataset for chart labels. Contains label text and rendering information.
2. **`Chart`**: IIFE. Returns object `{ render: render }`    
   1. Define variables
   2. Fetch external data (csv), then call `init`
   3. **`init(data)`** : Things that are not changed on different screensize. 
      1. Initialize scales. Set domains. 
      2. Initialize path generator for the chart.
      3. Append svg into template.
      4. Append a group for wrapping chart content (`chartWrapper`)
         - Append groups for line and x/y-axis into `chartWrapper`.
         - Append tooltip into `chartWrapper`. Hide it and add attributes/ styles that are not changing. 
      5. call `render()`
   4. **`render()`** : Things that are changing in different screensizes.  
      0. Appending any elements in `render()` will create new object on every dimension change of the viewport and render them on top of each other. Avoid appending. Append and create objects and element in `init()`. Here, we only update already-existing elements.
      1. Call `updateDimension(window.innerWidth)`: updates variables defined in 2 - i according to the screensize.
      2. Initialize axes and set tick properties acoording to the breakpoint.
      3. Set ranges (`[0, width], [height, 0]`) for scales.   
      4. Position axis group according to the updated dimensions.
      5. Draw line. (Set path attr 'd' with path-string generated by iii-b.
      6. Call `renderLabels()`: renders chart labels on different coordinates acoording to the dimension.
      7. Implement the tooltip. Add lisnteners to `svg`.
   5. **`updateDimension(winWidth)`** : Update margins and width/hight based on the passed innerWidth.
   6. **`renderLabels`**: Update any existing labels. If none, create and append new ones.
   7. return object `{render: render}`
3. `window.addEventListener('resize', Chart.render)`
      
   
