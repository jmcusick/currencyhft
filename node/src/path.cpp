#include "path.h"
#include "sql/api.h"
#include <limits>
#include <utility>
#include <iostream>

using namespace std;

//construct a path based on a given graph, starting currency, and ending currency
Path::Path(const Graph& graph, const string& start, const string& end) {
  //find and store the optimal path
  DistanceEstimates dists = graph.FindOptimalPaths(start);
  path = graph.GetOptimalPath(dists, end);

  //check that a path was actually found
  if (path.size() == 0) {
    cout << "Error: Path not possible" << endl;
    return;
  }

  cout << "Found optimal path from " << start << " to " << end << ":" << endl;
  for (auto it = path.begin(); it != path.end(); ++it) {
    cout << "\t" << *it << endl;
  }
}


double Path::ConvertStartAmount(const double& start) {
  API *db = new API();
  int retVal = db->connect();

  auto itrTo = path.begin();
  ++itrTo;
  auto itrFrom = path.begin();

  while (itrTo != path.end()) {
    cout << *itrFrom << " to " << *itrTo << endl;
    ++itrTo;
    ++itrFrom;
  }

  return start;
}
