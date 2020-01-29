class Star < ApplicationRecord
  enum amount: 1...5
  belongs_to :program
  belongs_to :user
  
end
