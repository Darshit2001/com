// will give all the index of a particular element in array
//   using set<int > passing set in function & return type as set<int>


#include <bits/stdc++.h>

using namespace std;

set<int> ind(int a[],int n, set<int > s,int val)
{  if(n==0)
   {  if(a[n]==val)
      s.insert(n);
      return s;
       
   }
   
    if(a[n]==val)
      s.insert(n);
    
    return ind(a,n-1,s,val);
}





int main() {
    int n,i,val;
    set<int > s;
    cin>>n>>val;
     int a[n];
    for(i=0;i<n;i++)
      cin>>a[i];
     auto pr= ind(a,n-1 ,s,val);
    for(auto v:pr)
     cout<<v<<endl;
    
    
    
}