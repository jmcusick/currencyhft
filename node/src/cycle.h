#ifndef CYCLE_H
#define CYCLE_H

#include <unordered_map>
#include <string>
#include <vector>
#include <iostream>
#include "sql/api.h"

using namespace std;

/*
  Cycle stores a path of nodes that form a negative cycle
  The starting node of the cycle is selected to be the first node in alphanumerical order
  Each node after the first follows the previous node, with the last node looping back to the start
*/
class Cycle {

  public:
    //===========Constructors===========
    Cycle(const unordered_map<string, string>& path, bool bankFlag);
    Cycle(const vector<string>& path, bool bankFlag);

    //===========Setters================
    double CalcRate(API *db);
    double CalcRate(unordered_map<string, double>& rates);

    //===========Getters================
    vector<string>* GetCycle() {return &cycle;}
    unsigned int GetSize() const {return cycle.size();}
    double GetTotalRate() const {return rate;}

    //===========Helpers================
    bool CheckEquivalent(const unordered_map<string, string>& other);
    bool CheckEquivalent(Cycle& other);
    void UpdateDatabase(API *db) const;

  private:
    vector<string> cycle;
    double rate;
    bool bank;
};

#endif