function Graph({currentRoom, connectedUsers}) {
  this.nodes = eval('[' + ('[' + '{},'.repeat(currentRoom.size.x) + '],').repeat(currentRoom.size.y) + ']');
  currentRoom.blocked.forEach(({x, y}) => this.nodes[y][x] = null);
  var flag = [];
  for (var y = 0; y < currentRoom.size.y; y++)
    for (var x = 0; x < currentRoom.size.x; x++) {
      var node = this.nodes[y][x], tmp;
      node.edges = new Map();
      if (tmp = this.nodes[y][x - 1])
        node.edges.set(tmp, 'left');
      if (tmp = this.nodes[y][x + 1])
        node.edges.set(tmp, 'right');
      if (tmp = this.nodes[y - 1]?.[x])
        node.edges.set(tmp, 'down');
      if (tmp = this.nodes[y + 1]?.[x])
        node.edges.set(tmp, 'up');
      node.users = new Map();
      node.flag = flag;
    }
  currentRoom.forbiddenMovements.forEach(({xFrom, yFrom, xTo, yTo}) => this.nodes[yFrom][xFrom].edges.delete(this.nodes[yTo][xTo]));
  this.users = new Map();
  connectedUsers.forEach(({id, position}) => {
    var node = this.nodes[position.y][position.x];
    node.users.set(id);
    this.users.set(id, node);
  });
  for (var key in currentRoom.doors) {
    var door = currentRoom.doors[key];
    this.nodes[door.y][door.x].door = door;
  }
}
Graph.prototype.update = function ({userId, x, y}) {
  this.users.get(userId).users.delete(userId);
  if (this.nodes[y][x]?.users.set(userId))
    this.users.set(userId, this.nodes[y][x]);
};

