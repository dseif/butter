/**********************************************************************************

Copyright (C) 2011 by Mozilla Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

**********************************************************************************/

(function() {
  define( [ "core/logger", "core/eventmanager" ], function( Logger, EventManager ) {

    var Target = function ( options ) {
      var id = Target.guid++,
          _this = this,
          logger = new Logger( id ),
          em = new EventManager( this ),
          options = options || {},
          name = options.name || "Target" + id + Date.now();

      this.object = options.object;
      this.elem = document.getElementById( this.object );

      function showOverlay( e ) {
        _this.overlay.style.display = "block";
      }

      function hideOverlay( e ) {
        _this.overlay.style.display = "none";
      }

      function createOverlay( rectBounds ) {
        var overlay = document.createElement( "div" );
        overlay.style.zIndex = _this.elem.style.zIndex + 1;
        overlay.className += " butter-target-overlay";

        overlay.style.left = rectBounds.left + "px";
        overlay.style.top = rectBounds.top + "px";
        overlay.style.width = rectBounds.width + "px";
        overlay.style.height = rectBounds.height + "px";
        document.body.appendChild( overlay );
        _this.overlay = overlay;
      }

      createOverlay( this.elem.getBoundingClientRect() );

      this.elem.addEventListener( "mouseover", showOverlay, false);
      this.elem.addEventListener( "mouseout", hideOverlay, false);

      em.listen( "trackeventmouseup", function( e ) {
        hideOverlay();
      });

      em.listen( "trackeventmouseover", function( e ) {
        showOverlay();
      });

      em.listen( "trackeventmouseout", function( e ) {
        hideOverlay();
      });

      em.listen( "trackeventmousedown", function( e ) {
        showOverlay();
      });

      Object.defineProperty( this, "name", {
        get: function() {
          return name;
        },
      });

      Object.defineProperty( this, "id", {
        get: function() {
          return id;
        },
      });

      Object.defineProperty( this, "json", {
        get: function() {
          var obj;
          try {
            obj = JSON.stringify( this.object );
          }
          catch ( e ) {
            obj = this.object.toString();
          }
          return {
            id: id,
            name: name,
            object: obj
          };
        },
        set: function( importData ) {
          if ( importData.name ) {
            name = importData.name
          }
          this.object = importData.object
        }
      });
    }; //Target
    Target.guid = 0;

    return Target;

  }); //define
})();
